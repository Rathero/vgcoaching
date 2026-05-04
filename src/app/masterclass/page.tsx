import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import MasterclassNotify from "@/components/MasterclassNotify/MasterclassNotify";
import { getMasterclasses } from "@/lib/firestore";
import { MasterclassBadge, MasterclassSubtitle, ComingSoonTitle, ComingSoonText, TopicsList, SlotsText, BookSlotBtn } from "./MasterclassTexts";
import styles from "./page.module.css";

export const metadata = {
  title: "Masterclasses — Dargog",
  description: "Aprende de los mejores pros en sesiones en vivo sobre temas específicos de League of Legends.",
};

export default async function MasterclassPage() {
  let masterclasses: Awaited<ReturnType<typeof getMasterclasses>> = [];
  
  try {
    masterclasses = await getMasterclasses("upcoming");
  } catch {
    // Firestore might not have the collection yet
  }

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <span className={styles.badge}><MasterclassBadge /></span>
            <h1 className={styles.title}>
              Master<span className={styles.gradient}>classes</span>
            </h1>
            <p className={styles.subtitle}>
              <MasterclassSubtitle />
            </p>
          </div>

          {masterclasses.length > 0 ? (
            <div className={styles.grid}>
              {masterclasses.map(mc => (
                <div key={mc.id} className={`glass-card ${styles.card}`}>
                  <div className={styles.cardImage}>
                    {mc.imageUrl ? (
                      <img src={mc.imageUrl} alt={mc.title} />
                    ) : (
                      <div className={styles.cardImagePlaceholder}>
                        <span>🎓</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardTags}>
                      {mc.tags?.map(tag => (
                        <span key={tag} className={styles.cardTag}>{tag}</span>
                      ))}
                    </div>
                    <h3 className={styles.cardTitle}>{mc.title}</h3>
                    <p className={styles.cardDesc}>{mc.description}</p>
                    <div className={styles.cardMeta}>
                      <span className={styles.cardCoach}>
                        {mc.coachAvatar} {mc.coachName}
                      </span>
                      <span className={styles.cardDate}>
                        📅 {new Date(mc.scheduledDate).toLocaleDateString("es-ES", { day: "numeric", month: "short" })} · {mc.scheduledTime}h
                      </span>
                    </div>
                    <div className={styles.cardFooter}>
                      <span className={styles.cardAttendees}>
                        <SlotsText current={mc.currentAttendees} max={mc.maxAttendees} />
                      </span>
                      <button className={styles.cardBtn}><BookSlotBtn /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Coming soon state */
            <div className={styles.comingSoon}>
              <div className={styles.comingSoonGlow} />
              <div className={styles.comingSoonContent}>
                <div className={styles.comingSoonIcon}>
                  <span>🎓</span>
                </div>
                <h2 className={styles.comingSoonTitle}><ComingSoonTitle /></h2>
                <p className={styles.comingSoonText}>
                  <ComingSoonText />
                </p>
                <div className={styles.topicGrid}>
                  <TopicsList />
                </div>
                <MasterclassNotify />
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
