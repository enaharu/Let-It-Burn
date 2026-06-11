/**
 * Paper型
 * 
 * ユーザーが入力したモヤモヤを「紙」として表現します
 * ドラッグ中の位置情報も保持します
 */
export type Paper = {
  id: string;              // 一意の識別子（複数の紙を区別するため）
  text: string;            // ユーザー入力のモヤモヤテキスト
  position: { x: number; y: number };  // ドラッグ時の位置（画面座標）
};
