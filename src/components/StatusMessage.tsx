type StatusMessageProps = {
  isVisible: boolean;
};

export function StatusMessage({ isVisible }: StatusMessageProps) {
  return (
    <p className={isVisible ? "status-message is-visible" : "status-message"}>
      モヤモヤを処分しました
    </p>
  );
}