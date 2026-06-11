type MoodInputProps = {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function MoodInput({
  value,
  disabled,
  onChange,
  onSubmit,
}: MoodInputProps) {
  return (
    <section className="mood-form" aria-label="モヤモヤ入力フォーム">
      <label className="mood-label" htmlFor="mood-textarea">
        今のモヤモヤをここに置いてください
      </label>
      <textarea
        id="mood-textarea"
        className="mood-textarea"
        value={value}
        disabled={disabled}
        placeholder="たとえば、今日の会議がずっと頭に残っている"
        onChange={(event) => onChange(event.target.value)}
      />
      <button
        type="button"
        className="offer-button"
        disabled={disabled || value.trim().length === 0}
        onClick={onSubmit}
      >
        🗑️シュレッダーにかける
      </button>
    </section>
  );
}