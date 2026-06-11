type BonfireStageProps = {
  noteText: string;
  isBurning: boolean;
  onBurnComplete: () => void;
};

export function BonfireStage({
  noteText,
  isBurning,
  onBurnComplete,
}: BonfireStageProps) {
  return (
    <section className="bonfire-stage" aria-label="シュレッダーステージ">
      <p className="stage-caption">
        紙に移したモヤモヤを投入口へ流し込み、細かく切って手放します。
      </p>

      {noteText ? (
        <article
          className={isBurning ? "note-paper is-burning" : "note-paper"}
          aria-live="polite"
          onAnimationEnd={isBurning ? onBurnComplete : undefined}
        >
          <div className="note-text">{noteText}</div>
        </article>
      ) : (
        <p className="resting-message">まだ細断する紙はありません。</p>
      )}

      <div className={isBurning ? "shredder-wrap is-active" : "shredder-wrap"} aria-hidden="true">
        <div className="shredder-top">
          <div className="shredder-slot" />
          <div className="shredder-teeth" />
        </div>
        <div className="shredder-body" />
        <div className="shredder-bin" />
        <div className="shredder-strips">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </section>
  );
}