import { sendFunds } from "./actions";
import FundsUI from "./fundComponent";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <FundsUI onSubmit={sendFunds} />
    </main>
  );
}
