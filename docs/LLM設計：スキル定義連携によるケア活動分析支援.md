# LLM設計：スキル定義連携によるケア活動分析支援

## 🎯 目的

ケア活動（育児・介護・家事等）の記録をもとに、LLMがスキルの傾向・発揮の文脈・職務経歴書向けの表現を出力する。その際、評価の透明性と信頼性を担保するため、事前に定義されたスキル情報（定義・出典フレームワーク・URL）をLLMに提供し、判断の根拠として活用させる。

---

## 🧩 使用構成の概要

| 要素             | 技術・構成例                                               |
| ---------------- | ---------------------------------------------------------- |
| LLM              | OpenAI GPT-4 Turbo（function calling対応）                 |
| スキル定義形式   | JSON（スキル名・定義・フレームワーク名・URL）              |
| 定義読み込み方式 | systemメッセージ／インラインコンテキスト／ベクトル検索連携 |
| データ検索       | Supabase pgvector, Pinecone, Weaviateなど                  |
| 活動入力         | ユーザーによる自然言語の活動記録（フォーム／チャット）     |
| 出力             | JSON構造 or Markdown箇条書き                               |

---

## 🧾 実装ステップとプロンプト設計

### ステップ1：スキル定義の構造化

```json
[
  {
    "name": "マルチタスク管理能力",
    "definition": "複数の作業を同時に進行し、適切に切り替えて遂行する能力",
    "framework": "経済産業省 社会人基礎力（情況把握力）＋OECD 社会情動的スキル（自己制御力・持続性）",
    "url": "https://www.meti.go.jp/policy/kisoryoku/ および https://www.oecd.org/education/DeSeCo-Project.htm"
  },
  {
    "name": "問題解決・危機対応力",
    "definition": "課題を発見し、冷静に対応策を立案・実行する能力",
    "framework": "経済産業省 社会人基礎力（課題発見力・ストレスコントロール力）＋OECD 社会情動的スキル（v・ストレス耐性）",
    "url": "https://www.meti.go.jp/policy/kisoryoku/ および https://www.oecd.org/education/DeSeCo-Project.htm"
  },
  {
    "name": "コミュニケーション能力",
    "definition": "相手の話を理解し、自分の考えを明確に伝える能力",
    "framework": "厚生労働省 職業能力評価基準（介護）＋経済産業省 社会人基礎力（発信力・傾聴力）＋OECD 社会情動的スキル（協調性・信頼）",
    "url": "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000190691.html および https://www.meti.go.jp/policy/kisoryoku/ および https://www.oecd.org/education/DeSeCo-Project.htm"
  },
  {
    "name": "忍耐力・感情マネジメント",
    "definition": "困難な状況下でも冷静さと前向きさを保つ能力",
    "framework": "経済産業省 社会人基礎力（前に踏み出す力・ストレスコントロール力）＋OECD 社会情動的スキル（感情のコントロール・楽観性）",
    "url": "https://www.meti.go.jp/policy/kisoryoku/ および https://www.oecd.org/education/DeSeCo-Project.htm"
  },
  {
    "name": "計画力・時間管理能力",
    "definition": "目標達成に向けて計画を立て、優先順位を整理して遂行する能力",
    "framework": "経済産業省 社会人基礎力（計画力・規律性）＋OECD 社会情動的スキル（責任感・勤勉さ）",
    "url": "https://www.meti.go.jp/policy/kisoryoku/ および https://www.oecd.org/education/DeSeCo-Project.htm"
  },
  {
    "name": "共感・傾聴力",
    "definition": "相手の立場や感情に寄り添い、丁寧に話を聞く能力",
    "framework": "経済産業省 社会人基礎力（柔軟性・傾聴力）＋OECD 社会情動的スキル（共感）",
    "url": "https://www.meti.go.jp/policy/kisoryoku/ および https://www.oecd.org/education/DeSeCo-Project.htm"
  },
  {
    "name": "サポート力",
    "definition": "他者の立場に立ち、必要に応じて支援・補助を行う能力",
    "framework": "OECD 社会情動的スキル（協調性・協力）＋ILO 5R（Recognizeフレームワーク）",
    "url": "https://www.oecd.org/education/DeSeCo-Project.htm および https://www.ilo.org/global/topics/care-economy/lang--en/index.htm"
  }
]
```

### ステップ2：systemメッセージに埋め込む

```text
あなたはケア活動からスキルを抽出する支援者です。
以下のスキル定義を参照し、ユーザーの活動記録から適切なスキルを最大5件抽出してください。

各スキルには次の情報を含めて出力してください：
- スキル名
- 定義
- フレームワーク名
- URL
- なぜそのスキルが活動と関連していると判断できるか
- 発揮傾向（強く見られる／よく見られる／少し見られる）
- 関連性の高さ（高い／中程度／低い）

【スキル定義】:
...
```

---

## 🏁 出力フォーマット（再掲）

```json
{
  "skills": [
    {
      "name": "計画力・時間管理能力",
      "tendency": "強く見られる",
      "relevance": "高い",
      "reason": "事前準備によってスムーズに行動したため",
      "definition": "目標達成に向けて計画を立て、優先順位を整理して遂行する能力",
      "framework": "経済産業省 社会人基礎力（計画力・規律性）＋OECD 社会情動的スキル（責任感・勤勉さ）",
      "url": "https://www.meti.go.jp/policy/kisoryoku/ および https://www.oecd.org/education/DeSeCo-Project.htm"
    }
  ],
  "resume_summary": [
    "事前準備によって送迎業務を円滑に進行し、時間管理能力を発揮",
    "日常の活動においても柔軟な対応と計画性をもって行動"
  ]
```

---

## 💡 メモ・補足

- 各スキルには日本語・英語両対応の定義を用意しても良い（国際展開時）
- systemメッセージに含めるスキル定義が長すぎる場合は、カテゴリ別でグルーピングして日替わりロード方式なども検討可
- 特定の出典に偏らないよう、複数フレームワーク（厚労省・経産省・OECD等）からのバランスを意識する
