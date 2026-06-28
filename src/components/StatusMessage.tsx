import { motion } from "framer-motion";

interface StatusMessageProps {
  visible: boolean;
  onReset: () => void;
  text: string;
}

interface ResponseMessage {
  summary: string;
  detail: string;
}

interface ResponseRule extends ResponseMessage {
  pattern: RegExp;
}

const responseRules: ResponseRule[] = [
{
    pattern: /死にたい|消えたい|自傷|自殺|終わりにしたい|いなくなりたい/,
    summary: "消えてしまいたいほどの重さを、\nここでお焚き上げすることができました。",
    detail: "その深い悩みはひとりで抱え込まず、\n信頼できる人や専門の相談先に預けて大丈夫です。",
  },
  {
    pattern: /不安|怖い|こわい|心配|ざわざわ|落ち着かない/,
    summary: "その不安は、\n炎の中で静かに煙となりました。",
    detail: "深く息を吐いて、\n今はただ、少しだけ心を緩めてみてください。",
  },
  {
    pattern: /焦り|焦る|あせる|間に合わない|急がなきゃ/,
    summary: "胸を急かす焦りの熱は、\nこの炎のなかで、少し速度を落としました。",
    detail: "全部を一度に追わなくて大丈夫です。\n今できる一つだけに、ゆっくり意識を戻しましょう。",
  },
  {
    pattern: /怒|腹立|腹が立|むか|ムカ|イラ|苛|理不尽/,
    summary: "強い怒りのエネルギーは、\n炎の中にくべられ、静かに燃え落ちました。",
    detail: "あなたが正しさを一人で抱え続けなくても、\nもう大丈夫ですよ。",
  },
  {
    pattern: /許せない|納得できない|不公平|ずるい|報われない/,
    summary: "納得できなかった気持ちは、\n炎の中で静かに灰へと変わっていきました。",
    detail: "あなたが傷ついたその感覚まで、\nなかったことにしなくて大丈夫です。",
  },
  {
    pattern: /喧嘩|けんか|言い合い|衝突|揉め|もめ/,
    summary: "ぶつかった言葉の痛い熱は、\nここで静かに冷めていきました。",
    detail: "少し距離を置く時間も、\nお互いの関係を整えるための大切なプロセスです。",
  },
  {
    pattern: /上司|部長|課長|先輩|職場|会社/,
    summary: "職場で受けた理不尽さは、\nこの炎の中に、いったん全て降ろしてしまいましょう。",
    detail: "会社からの評価と、\nあなた自身の本当の価値は全く同じではありません。",
  },
  {
    pattern: /同僚|後輩|チーム|会議|slack|チャット/,
    summary: "人との仕事で積もった疲れは、\nここで少しずつほどけはじめました。",
    detail: "今日は全部を背負い込まず、\n残った仕事は、明日の自分に預けて大丈夫です。",
  },
  {
    pattern: /客|お客様|クレーム|取引先|依頼者/,
    summary: "受け止めすぎた言葉は、\n炎の中で静かに煙となりました。",
    detail: "相手のネガティブな感情まで、\nあなたが背負う必要はありません。",
  },
  {
    pattern: /仕事|残業|タスク|納期|締切|締め切り/,
    summary: "仕事に追われる重い圧は、\nここで少し軽くなりました。",
    detail: "タスクをやり遂げる前に、\n自分をすり減らしすぎないよう、一息つきましょう。",
  },
  {
    pattern: /家族|親|母|父|兄弟|姉妹|実家/,
    summary: "家族のことで揺れた心は、\nここでそっと火に預け、距離を取れました。",
    detail: "近い関係であるからこそ、\n自分を守り、休むための「心の距離」が必要です。",
  },
  {
    pattern: /恋人|彼氏|彼女|夫|妻|パートナー|好きな人/,
    summary: "大切な人への切ないもやもやは、\n炎のぬくもりのなかで、一度やわらぎました。",
    detail: "相手を思いやることと、\n自分自身を一番に大事にすることは、ちゃんと両立します。",
  },
  {
    pattern: /友達|友人|親友|知り合い|グループ/,
    summary: "友人関係の引っかかりは、\n炎の中で少しずつほどけました。",
    detail: "無理に笑顔を作ろうとせず、\nあなたの本来のペースを大切にしてくださいね。",
  },
  {
    pattern: /ひとり|一人|孤独|寂しい|さみしい|誰もいない/,
    summary: "寂しいと思うことは、\n決して悪いことではありません。",
    detail: "その胸の痛みは、\n誰に言えなくても、確かに本物です。",
  },
  {
    pattern: /比べ|比較|劣等感|sns|インスタ|羨ましい|うらやましい/,
    summary: "他人が羨ましくなる焦りは、\nこの炎を見つめるうちに、静かに凪いでいきました。",
    detail: "他人の輝く一場面（ハイライト）と、\nあなたの等身大のすべてを比べる必要はありませんよ。",
  },
  {
    pattern: /嫉妬|妬|ねた|やきもち|悔しい/,
    summary: "嫉妬や悔しさのヒリヒリした熱は、\nこの火の中にそっと収まりました。",
    detail: "それだけ「欲しかったもの」に気づけたことも、\nあなたの心が放った、大切なサインです。",
  },
  {
    pattern: /失敗|ミス|だめ|ダメ|やらか|しくじ/,
    summary: "失敗の苦い痛みは、\nこの火がすべて燃やし尽くしました。",
    detail: "一度燃えて消えたものは、\nもう明日まで追いかけてきません。",
  },
  {
    pattern: /後悔|戻りたい|過去|なんであんな|あの時|あのとき/,
    summary: "過去に戻る切ない思いは、\n炎の光の中に溶けていきました。",
    detail: "変えられないあの場面ではなく、\nここからの時間を、新しく選んでいけます。",
  },
  {
    pattern: /罪悪感|申し訳|ごめん|迷惑|責め/,
    summary: "自分を責める苦しい声は、\n炎の中で静かに小さくなりました。",
    detail: "ひとまず今夜は、\n自分に罰を与えるのを終わりにして大丈夫です。",
  },
  {
    pattern: /恥ずかしい|恥|黒歴史|思い出したくない|穴があったら/,
    summary: "赤面するような恥ずかしさの熱は、\nこの炎がすべて包み込みました。",
    detail: "そのたった一場面だけで、\nあなたのすべてが決まるわけではありません。",
  },
  {
    pattern: /自信|自分なんて|価値ない|向いてない|無能/,
    summary: "自分を小さく見積もる言葉は、\nここで綺麗に燃やせました。",
    detail: "今夜の落ち込んだ気分が、\nあなたの本当の価値ではありません。",
  },
  {
    pattern: /完璧|ちゃんとしなきゃ|べき|ミスできない|期待/,
    summary: "完璧でいなきゃという張り詰めた\n力みは、ここで少し緩みました。",
    detail: "全てを完璧にこなさなくても、\nあなたはすでに、十分にやっています。",
  },
  {
    pattern: /先延ばし|後回し|サボ|できてない|やる気出ない/,
    summary: "動けなかった自分への自己嫌悪は、\nここで火の中に手放せました。",
    detail: "明日のことは明日考えましょう。\n今はただ、何もしない贅沢を自分に許してください。",
  },
  {
    pattern: /迷う|決められない|選べない|どうしたら|わからない/,
    summary: "先の見えない暗い迷いは、\n炎の灯りのなかで、少しほどけました。",
    detail: "答えを急いで出す必要はありません。\n一番大事にしたいものから、ゆっくり見つめ直しましょう。",
  },
  {
    pattern: /多すぎ|いっぱい|抱えきれない|キャパ|限界/,
    summary: "限界まで抱え込んだタスクの重さは、\nここでいったん下ろせました。",
    detail: "優先順位を並べる前に、\nまずは深く、息を整えましょう。",
  },
  {
    pattern: /疲|しんど|つら|辛い|くたくた|へとへと/,
    summary: "くたくたに疲れたその気持ちは、\nこの炎のそばで、そっと休ませてあげましょう。",
    detail: "今は、無理に立ち上がろうとせず、\nただ心と体をゆるめることを最優先にしてください。",
  },
  {
    pattern: /眠れない|寝不足|起きれない|寝たい|睡眠/,
    summary: "眠れなくて焦る心は、\nゆらめく火を見つめるうちに、少し静まりました。",
    detail: "あれこれと考えてしまう頭を休めて、\nただ布団の温かさだけに包まれてください。",
  },
  {
    pattern: /痛い|頭痛|胃|体調|だるい|具合/,
    summary: "体から来るつらさは、\nこの炎の暖かさでやさしく包み込みました。",
    detail: "気合いで乗り越えようとする前に、\n体を休めるための真っ当な理由にしてください。",
  },
  {
    pattern: /お金|金欠|給料|支払い|家賃|貯金/,
    summary: "お金にまつわる焦りや不安は、\nここで一度、静かに燃やし尽くしました。",
    detail: "先のことを恐れすぎず、\nまずは今日を無事に過ごせた自分を褒めてあげましょう。",
  },
  {
    pattern: /時間|遅刻|遅れ|忙しい|予定|スケジュール/,
    summary: "時間に追われる息苦しさは、\nここで少しゆるみました。",
    detail: "急がなきゃいけない日ほど、\nここで一度だけ、深く息を吐いて大丈夫です。",
  },
  {
    pattern: /満員|電車|通勤|渋滞|人混み|行列/,
    summary: "人混みや移動で削られた気力は、\n炎の静けさのなかで、少しずつ戻ってきます。",
    detail: "ただ移動しただけ、ただそこにいただけで、\nあなたは十分にエネルギーを使っています。",
  },
  {
    pattern: /家事|掃除|洗濯|料理|片付け|部屋/,
    summary: "暮らしの積み残しによる重荷は、\nここで少し軽くなりました。",
    detail: "部屋を整える前に、\nまずは頑張った自分の呼吸を整えてあげましょう。",
  },
  {
    pattern: /育児|子ども|子供|赤ちゃん|保育園|学校/,
    summary: "大切な誰かを支える疲れは、\nこの場所で、そっと預からせてください。",
    detail: "いつも一生懸命頑張っているからこそ、\nあなた自身が荷物を下ろす場所が必要です。",
  },
  {
    pattern: /勉強|試験|テスト|課題|宿題|単位/,
    summary: "学びや成果への重いプレッシャーは、\nここで少し、勢いを失って燃え落ちました。",
    detail: "まだできていない所ではなく、\nこれまで積み重ねてきた自分の時間を信じてあげましょう。",
  },
  {
    pattern: /就活|転職|面接|履歴書|キャリア|将来/,
    summary: "将来への重たい問いは、\n炎の中にそっと預けられました。",
    detail: "人生のすべてを一度で決めようとせず、\n目の前の小さな選択から進めば大丈夫です。",
  },
  {
    pattern: /作れない|書けない|描けない|アイデア|スランプ/,
    summary: "生み出せない焦りの熱は、\nこの炎が優しく引き取りました。",
    detail: "何も形にならない空白の時間も、\n次に新しいものが芽吹くための大切な休息です。",
  },
  {
    pattern: /退屈|虚しい|むなしい|空っぽ|何もない/,
    summary: "空っぽに感じる寂しい時間は、\nここで静かに受け止めました。",
    detail: "何かで無理に満たそうとする前に、\n心が休んでいる今の状態を責めないであげてください。",
  },
  {
    pattern: /分かってくれない|わかってくれない|伝わらない|誤解|理解されない/,
    summary: "誰にも届かなかった切ない悲しさは、\nここで少しほどけました。",
    detail: "想いが相手に届かなかったことと、\nあなたの言葉や気持ちに価値がないことは全く違います。",
  },
  {
    pattern: /断られ|拒否|否定|嫌われ|無視|既読/,
    summary: "拒まれたような痛みのトゲは、\n炎の中で静かに灰となりました。",
    detail: "誰かの不誠実な反応だけで、\nあなたの居場所や価値が消えるわけではありません。",
  },
  {
    pattern: /悲しい|泣きたい|涙|かなしい|切ない/,
    summary: "胸にたまった悲しさは、\n炎のぬくもりのそばで、静かに溶けていきました。",
    detail: "涙をこらえる必要はありません。\nここには、その涙を静かに乾かす火があります。",
  },
  {
    pattern: /別れ|失恋|離れ|終わった|振られ/,
    summary: "失った関係の深い痛みは、\nここでいったん、静かに火に解き放ちましょう。",
    detail: "無理に前を向く必要はありません。\n今日という日を越えられただけで、本当に十分です。",
  },
  {
    pattern: /寂れ|喪失|亡く|訃報|お別れ/,
    summary: "大切なものへの消えない思いは、\nここで優しく、小さな灯りとなりました。",
    detail: "無理に忘れるためではなく、\nこれからも胸の奥でそっと抱えていくために、ここに置いていってください。",
  },
  {
    pattern: /希望がない|無理|もう無理|終わり|詰んだ/,
    summary: "行き止まりに見えた絶望は、\n炎のゆらめきの中で、少し形を変えました。",
    detail: "どうしようもない時は、解決しようとせず、\n今夜はただ温かくして眠りましょう。",
  },
  {
    pattern: /やる気|モチベ|気力|何もしたくない/,
    summary: "動けない心体の重さは、\nここで少し軽くなりました。",
    detail: "無理に動き出す必要はありません。\n今はただ、心にエネルギーが満ちるのをじっと待つ時間です。",
  },
  {
    pattern: /雨|暑い|寒い|天気|湿気|低気圧/,
    summary: "天候に引っ張られて沈んだ気分は、\nここで少し暖かく整いました。",
    detail: "気圧や天気のせいで体が重いのは、\nあなたの心が弱いせいでは決してありません。",
  },
  {
    pattern: /うるさい|騒音|暑苦しい|寒すぎ|環境|散らか/,
    summary: "外部の環境から受けたストレスは、\nこの炎の壁の向こうへシャットアウトしました。",
    detail: "小さな不快も、積もれば大きな疲れになります。\n自分だけの静かな空間を、今ここで取り戻しましょう。",
  },
  {
    pattern: /スマホ|パソコン|pc|アプリ|バグ|エラー|通信/,
    summary: "思い通りに動かない苛立ちは、\nここで綺麗に燃やし尽くしました。",
    detail: "機械やシステムの不調に引きずられて、\nあなたの心まで不調にさせなくて大丈夫です。",
  },
  {
    pattern: /ニュース|政治|社会|事件|戦争|災害/,
    summary: "外の世界のノイズや重みからは、\nここで一度、静かに意識を離しましょう。",
    detail: "世界を憂う優しさを持つことと、\nそのすべての重みを一人で背負うことは違います。",
  },
  {
    pattern: /見た目|太った|肌|髪|老け|コンプレックス/,
    summary: "自分の見た目に向けるトゲトゲした視線は、\nここで少し和らぎました。",
    detail: "誰かの作った基準で自分を裁かず、\n毎日を生きているその体をご自愛してあげてください。",
  },
  {
    pattern: /食べ過ぎ|飲み過ぎ|食欲|ダイエット|暴飲/,
    summary: "食べてしまったことへの後ろめたさは、\n炎の中で綺麗に煙となりました。",
    detail: "自分を責めるのはおしまいです。\nそれはその時のあなたに、どうしても必要なエネルギーだったのですから。",
  },
  {
    pattern: /嘘|うそ|隠し|秘密|言えない/,
    summary: "誰にも言えなかった秘密の重さは、\nここで少し外に出せました。",
    detail: "言葉にしきれないモヤモヤも、\nこの火の中なら、安全に置いておけます。",
  },
  {
    pattern: /モヤ|もや|なんか嫌|なんとなく|理由ない|微妙/,
    summary: "名前のないモヤモヤは、\n炎の煙に乗って、静かに空へ消えていきました。",
    detail: "理由がはっきり説明できない嫌な予感や違和感も、\nあなたにとって大切な、本物の感情です。",
  },
];

const fallbackResponse: ResponseMessage = {
  summary: "今日のモヤモヤは、\nここで静かにほどけました。",
  detail: "言葉にするだけでも、\n気持ちは少し軽くなります。",
};

export default function StatusMessage({ visible, onReset, text }: StatusMessageProps) {
  if (!visible) {
    return null;
  }

  const normalizedText = text.normalize("NFKC").trim().toLowerCase();

  const getResponseMessage = () => {
    return responseRules.find(({ pattern }) => pattern.test(normalizedText)) ?? fallbackResponse;
  };

  const response = getResponseMessage();

  return (
    <motion.div
      className="status-message-container"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100%",
      }}
    >
      <motion.div
        className="status-message-inner"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.55 }}
        style={{
          textAlign: "center",
          position: "relative",
          padding: "30px 24px",
          borderRadius: "16px",
          background: "rgba(7, 8, 13, 0.42)",
          border: "1px solid rgba(255, 214, 170, 0.25)",
          backdropFilter: "blur(4px)",
        }}
      >
        <motion.div
          style={{
            position: "absolute",
            inset: "-100px",
            background:
              "radial-gradient(circle, rgba(255,190,110,0.28) 0%, rgba(255,190,110,0) 72%)",
            pointerEvents: "none",
          }}
          animate={{
            opacity: [0.44, 0.82, 0.44],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />

        <motion.h2
          className="status-title"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: "45px",
            fontWeight: "300",
            color: "#f7d9b6",
            marginBottom: "18px",
            letterSpacing: "3px",
            position: "relative",
            zIndex: 1,
          }}
        >
          手放しました
        </motion.h2>

        <motion.p
          className="status-subtitle"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: "18px",
            color: "#f0d7bc",
            marginBottom: "16px",
            position: "relative",
            zIndex: 1,
            whiteSpace: "pre-line",
          }}
        >
          {response.summary}
        </motion.p>

        <motion.p
          className="status-detail"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          style={{
            fontSize: "15px",
            color: "#ead1b3",
            marginBottom: "16px",
            position: "relative",
            zIndex: 1,
            lineHeight: 1.8,
            whiteSpace: "pre-line",
          }}
        >
          {response.detail}
        </motion.p>

        <motion.p
          className="status-input-text"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 0.8 }}
          transition={{ duration: 0.45 }}
          style={{
            fontSize: "14px",
            color: "#e3c19b",
            marginBottom: "40px",
            fontStyle: "italic",
            position: "relative",
            zIndex: 1,
            maxWidth: "400px",
            margin: "16px auto 40px",
          }}
        >
          「{text}」
        </motion.p>

        <motion.button
          className="status-reset-button"
          onClick={onReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45 }}
          style={{
            padding: "12px 32px",
            fontSize: "16px",
            backgroundColor: "rgba(245, 178, 114, 0.26)",
            color: "#ffe2c7",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(212, 165, 116, 0.22)",
            position: "relative",
            zIndex: 1,
            transition: "all 0.3s ease",
          }}
        >
          気持ちが軽くなった
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
