import styles from "./checkbox.module.css";

interface Props {
  label: string;
  checked?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Checkbox = ({ label, checked, onChange }: Props) => {
  return (
    <div className={styles.checkbox}>
      <input
        className={styles["checkbox__input"]}
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
    </div>
  );
};
