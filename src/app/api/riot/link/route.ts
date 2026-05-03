import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

const RIOT_API_KEY = process.env.RIOT_API_KEY || "";
const RIOT_API_BASE = "https://europe.api.riotgames.com";
const RIOT_API_EUW = "https://euw1.api.riotgames.com";

interface RiotAccount {
  puuid: string;
  gameName: string;
  tagLine: string;
}

interface RiotLeagueEntry {
  queueType: string;
  tier: string;
  rank: string;
  wins: number;
  losses: number;
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    const { gameName, tagLine, region } = await req.json();

    if (!gameName || !tagLine) {
      return NextResponse.json({ error: "Se requiere Riot ID (Nombre#Tag)" }, { status: 400 });
    }

    if (!RIOT_API_KEY || RIOT_API_KEY === "RGAPI-your-api-key-here") {
      return NextResponse.json({ error: "Riot API no configurada. Contacta al administrador." }, { status: 503 });
    }

    // Step 1: Get account by Riot ID
    const accountRes = await fetch(
      `${RIOT_API_BASE}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
      { headers: { "X-Riot-Token": RIOT_API_KEY } }
    );

    if (!accountRes.ok) {
      if (accountRes.status === 404) {
        return NextResponse.json({ error: "Cuenta de Riot no encontrada. Verifica tu Riot ID." }, { status: 404 });
      }
      return NextResponse.json({ error: "Error al conectar con Riot API" }, { status: 502 });
    }

    const account: RiotAccount = await accountRes.json();

    // Step 2: Get summoner by PUUID
    const regionBase = getRegionBase(region || "euw");
    const summonerRes = await fetch(
      `${regionBase}/lol/summoner/v4/summoners/by-puuid/${account.puuid}`,
      { headers: { "X-Riot-Token": RIOT_API_KEY } }
    );

    let summonerId = "";
    if (summonerRes.ok) {
      const summoner = await summonerRes.json();
      summonerId = summoner.id;
    }

    // Step 3: Get ranked info
    let riotRank = "Unranked";
    let riotTier = "";
    let riotWinRate = 0;

    if (summonerId) {
      const leagueRes = await fetch(
        `${regionBase}/lol/league/v4/entries/by-summoner/${summonerId}`,
        { headers: { "X-Riot-Token": RIOT_API_KEY } }
      );

      if (leagueRes.ok) {
        const entries: RiotLeagueEntry[] = await leagueRes.json();
        const soloQ = entries.find(e => e.queueType === "RANKED_SOLO_5x5");
        if (soloQ) {
          riotRank = `${soloQ.tier} ${soloQ.rank}`;
          riotTier = soloQ.tier.toLowerCase();
          const totalGames = soloQ.wins + soloQ.losses;
          riotWinRate = totalGames > 0 ? Math.round((soloQ.wins / totalGames) * 100) : 0;
        }
      }
    }

    // Step 4: Get top champions (from champion mastery)
    let riotTopChampions: { name: string; games: number; winRate: number; kda: number }[] = [];
    if (account.puuid) {
      const masteryRes = await fetch(
        `${regionBase}/lol/champion-mastery/v4/champion-masteries/by-puuid/${account.puuid}/top?count=3`,
        { headers: { "X-Riot-Token": RIOT_API_KEY } }
      );

      if (masteryRes.ok) {
        const masteries = await masteryRes.json();
        riotTopChampions = masteries.map((m: { championId: number; championPoints: number }) => ({
          name: getChampionName(m.championId),
          games: Math.round(m.championPoints / 1000), // Approximate games from mastery points
          winRate: 0, // Would need match history for accurate WR
          kda: 0,
        }));
      }
    }

    // Step 5: Save to user profile
    const riotData = {
      riotPuuid: account.puuid,
      riotGameName: account.gameName,
      riotTagLine: account.tagLine,
      riotRank,
      riotTier,
      riotWinRate,
      riotTopChampions,
      updatedAt: new Date().toISOString(),
    };

    await adminDb.collection("users").doc(uid).update(riotData);

    // If user is a coach, also update coach profile
    const userDoc = await adminDb.collection("users").doc(uid).get();
    const userData = userDoc.data();
    if (userData?.role === "coach" && userData?.coachId) {
      await adminDb.collection("coaches").doc(userData.coachId).update(riotData);
    }

    return NextResponse.json({
      success: true,
      data: {
        gameName: account.gameName,
        tagLine: account.tagLine,
        rank: riotRank,
        winRate: riotWinRate,
        topChampions: riotTopChampions,
      },
    });
  } catch (error) {
    console.error("Riot link error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

function getRegionBase(region: string): string {
  const regions: Record<string, string> = {
    euw: "https://euw1.api.riotgames.com",
    eune: "https://eun1.api.riotgames.com",
    na: "https://na1.api.riotgames.com",
    las: "https://la2.api.riotgames.com",
    lan: "https://la1.api.riotgames.com",
    br: "https://br1.api.riotgames.com",
  };
  return regions[region] || RIOT_API_EUW;
}

// Basic champion ID to name mapping (subset of most popular)
function getChampionName(id: number): string {
  const champions: Record<number, string> = {
    1: "Annie", 2: "Olaf", 3: "Galio", 4: "Twisted Fate", 5: "Xin Zhao",
    6: "Urgot", 7: "LeBlanc", 8: "Vladimir", 9: "Fiddlesticks", 10: "Kayle",
    11: "Master Yi", 12: "Alistar", 13: "Ryze", 14: "Sion", 15: "Sivir",
    16: "Soraka", 17: "Teemo", 18: "Tristana", 19: "Warwick", 20: "Nunu",
    21: "Miss Fortune", 22: "Ashe", 23: "Tryndamere", 24: "Jax", 25: "Morgana",
    26: "Zilean", 27: "Singed", 28: "Evelynn", 29: "Twitch", 30: "Karthus",
    31: "Cho'Gath", 32: "Amumu", 33: "Rammus", 34: "Anivia", 35: "Shaco",
    36: "Dr. Mundo", 37: "Sona", 38: "Kassadin", 39: "Irelia", 40: "Janna",
    41: "Gangplank", 42: "Corki", 43: "Karma", 44: "Taric", 45: "Veigar",
    48: "Trundle", 50: "Swain", 51: "Caitlyn", 53: "Blitzcrank", 54: "Malphite",
    55: "Katarina", 56: "Nocturne", 57: "Maokai", 58: "Renekton", 59: "Jarvan IV",
    60: "Elise", 61: "Orianna", 62: "Wukong", 63: "Brand", 64: "Lee Sin",
    67: "Vayne", 68: "Rumble", 69: "Cassiopeia", 74: "Heimerdinger",
    75: "Nasus", 76: "Nidalee", 77: "Udyr", 78: "Poppy", 79: "Gragas",
    80: "Pantheon", 81: "Ezreal", 82: "Mordekaiser", 84: "Akali",
    85: "Kennen", 86: "Garen", 89: "Leona", 90: "Malzahar", 91: "Talon",
    92: "Riven", 96: "Kog'Maw", 98: "Shen", 99: "Lux", 101: "Xerath",
    102: "Shyvana", 103: "Ahri", 104: "Graves", 105: "Fizz",
    110: "Varus", 111: "Nautilus", 112: "Viktor", 113: "Sejuani",
    114: "Fiora", 115: "Ziggs", 117: "Lulu", 119: "Draven",
    120: "Hecarim", 121: "Kha'Zix", 122: "Darius", 126: "Jayce",
    127: "Lissandra", 131: "Diana", 133: "Quinn", 134: "Syndra",
    136: "Aurelion Sol", 141: "Kayn", 142: "Zoe", 143: "Zyra",
    145: "Kai'Sa", 147: "Seraphine", 150: "Gnar", 154: "Zac",
    157: "Yasuo", 161: "Vel'Koz", 163: "Taliyah", 164: "Camille",
    166: "Akshan", 200: "Bel'Veth", 201: "Braum", 202: "Jhin",
    203: "Kindred", 221: "Zeri", 222: "Jinx", 223: "Tahm Kench",
    233: "Briar", 234: "Viego", 235: "Senna", 236: "Lucian",
    238: "Zed", 240: "Kled", 245: "Ekko", 246: "Qiyana",
    254: "Vi", 266: "Aatrox", 267: "Nami", 268: "Azir",
    350: "Yuumi", 360: "Samira", 412: "Thresh", 420: "Illaoi",
    421: "Rek'Sai", 427: "Ivern", 429: "Kalista", 432: "Bard",
    497: "Rakan", 498: "Xayah", 516: "Ornn", 517: "Sylas",
    518: "Neeko", 523: "Aphelios", 526: "Rell", 555: "Pyke",
    711: "Vex", 777: "Yone", 875: "Sett", 876: "Lillia",
    887: "Gwen", 888: "Renata Glasc", 895: "Nilah", 897: "K'Sante",
    901: "Smolder", 902: "Milio", 910: "Hwei", 950: "Naafiri",
  };
  return champions[id] || `Champion ${id}`;
}
