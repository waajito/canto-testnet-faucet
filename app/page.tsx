import FundsUI from "./fundComponent";
import styles from "./page.module.css";

export default function Home() {
  async function sendFunds(formData: any) {
    "use server";
    console.log(process.env.PRIVATE_KEY);
    console.log(formData);
  }
  return (
    <main className={styles.main}>
      <FundsUI onSumbit={sendFunds} />
    </main>
  );
}
