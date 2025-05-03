"use client";

import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  ArrowLeft,
  Mic,
  MicOff,
  Loader2,
  Check,
  X,
  Edit,
  ArrowRight,
  Brain,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ToastAction } from "@workspace/ui/components/toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Badge } from "@workspace/ui/components/badge";

// 活動タイプの定義
const ACTIVITY_TYPES = {
  childcare: "育児",
  eldercare: "高齢者ケア",
  healthcare: "医療サポート",
  emotional: "感情的サポート",
  household: "家事管理",
  education: "教育サポート",
  cooking: "料理",
  other: "その他",
};

// 活動タイプのアイコンカラー
const TYPE_COLORS = {
  childcare: "bg-blue-100 text-blue-800",
  eldercare: "bg-purple-100 text-purple-800",
  healthcare: "bg-green-100 text-green-800",
  emotional: "bg-yellow-100 text-yellow-800",
  household: "bg-gray-100 text-gray-800",
  education: "bg-indigo-100 text-indigo-800",
  cooking: "bg-orange-100 text-orange-800",
  other: "bg-rose-100 text-rose-800",
};

export default function ActivityLog() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("voice-text");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedActivities, setAnalyzedActivities] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // 音声認識用の参照
  const recognitionRef = useRef(null);

  // 従来のフォームデータ
  const [formData, setFormData] = useState({
    activityType: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    hours: 0,
    minutes: 0,
    skills: [],
    challenges: "",
    solutions: "",
    // チャットUI用の状態
    chatHistory: [],
    currentMessage: "",
    isAiTyping: false,
    chatStage: "initial", // initial, type, duration, skills, challenges, complete
    chatData: {
      activityType: "",
      description: "",
      hours: 0,
      minutes: 0,
      skills: [],
      challenges: "",
      solutions: "",
    },
    chatComplete: false,
  });

  // Web Speech API の初期化
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      // @ts-ignore - webkitSpeechRecognition はTypeScriptの型定義にないため
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "ja-JP";

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        setTranscript(
          (prevTranscript) =>
            prevTranscript + finalTranscript + interimTranscript
        );
      };

      recognitionRef.current.onerror = (event) => {
        console.error("音声認識エラー:", event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        if (isRecording) {
          recognitionRef.current.start();
        }
      };
    } else {
      toast({
        title: "音声認識に対応していません",
        description:
          "お使いのブラウザは音声認識をサポートしていません。テキスト入力をご利用ください。",
        variant: "destructive",
      });
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isRecording]);

  // 音声認識の開始/停止
  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setTranscript("");
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  // 活動の分析
  const analyzeActivity = async () => {
    if (!transcript.trim()) {
      toast({
        title: "テキストが入力されていません",
        description: "活動内容を入力または音声で記録してください。",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // APIリクエスト
      const response = await fetch("/api/analyze-activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: transcript,
          date: new Date().toISOString().split("T")[0],
        }),
      });

      if (!response.ok) {
        throw new Error("分析に失敗しました");
      }

      const data = await response.json();
      setAnalyzedActivities(data.activities);
      setShowConfirmation(true);
      setActiveTab("confirmation");
    } catch (error) {
      console.error("分析エラー:", error);
      // toast({
      //   title: "分析に失敗しました",
      //   description: "もう一度お試しいただくか、手動で入力してください。",
      //   variant: "destructive",
      // });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 活動の編集
  const editActivity = (index, field, value) => {
    const updatedActivities = [...analyzedActivities];
    updatedActivities[index] = {
      ...updatedActivities[index],
      [field]: value,
    };
    setAnalyzedActivities(updatedActivities);
  };

  // 活動の削除
  const removeActivity = (index) => {
    setAnalyzedActivities(analyzedActivities.filter((_, i) => i !== index));
  };

  // 活動の保存
  const saveActivities = async () => {
    setIsSubmitting(true);

    try {
      // 実際のアプリケーションではここでAPIリクエストを行います
      // 今回はモックとして遅延を入れています
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "活動が記録されました",
        description: `${analyzedActivities.length}件の活動が正常に記録されました。AIがスキルを分析しています。`,
        action: (
          <ToastAction altText="活動一覧を見る">活動一覧を見る</ToastAction>
        ),
      });

      // 活動一覧ページにリダイレクト
      router.push("/activities");
    } catch (error) {
      console.error("保存エラー:", error);
      toast({
        title: "保存に失敗しました",
        description: "もう一度お試しください。",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 従来のフォーム処理
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, activityType: value }));
  };

  const handleSkillChange = (e) => {
    const { checked, id } = e.target;
    const skillId = id.replace("skill-", "");

    setFormData((prev) => {
      if (checked) {
        return { ...prev, skills: [...prev.skills, skillId] };
      } else {
        return {
          ...prev,
          skills: prev.skills.filter((skill) => skill !== skillId),
        };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 実際のアプリケーションではここでAPIリクエストを行います
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "活動が記録されました",
        description:
          "あなたの活動が正常に記録されました。AIがスキルを分析しています。",
        action: (
          <ToastAction altText="活動一覧を見る">活動一覧を見る</ToastAction>
        ),
      });

      // 活動一覧ページにリダイレクト
      router.push("/activities");
    }, 1500);
  };

  // チャットメッセージの送信処理
  const handleChatSubmit = () => {
    if (!formData.currentMessage.trim()) return;

    // ユーザーのメッセージをチャット履歴に追加
    const userMessage = { sender: "user", text: formData.currentMessage };
    const updatedHistory = [...formData.chatHistory, userMessage];

    // 入力フィールドをクリアして、AIの返信中状態にする
    setFormData((prev) => ({
      ...prev,
      chatHistory: updatedHistory,
      currentMessage: "",
      isAiTyping: true,
    }));

    // AIの返信を処理（実際のアプリではここでAPIリクエストを行います）
    setTimeout(() => {
      let aiResponse = "";
      let nextStage = formData.chatStage;
      const updatedChatData = { ...formData.chatData };

      // チャットのステージに応じた処理
      switch (formData.chatStage) {
        case "initial":
          // 活動の説明を受け取った
          updatedChatData.description = formData.currentMessage;
          aiResponse =
            "活動のタイプを教えてください（育児、高齢者ケア、医療サポート、家事など）";
          nextStage = "type";
          break;

        case "type":
          // 活動タイプを受け取った
          const typeInput = formData.currentMessage.toLowerCase();
          let activityType = "other";

          // 入力から活動タイプを推測
          if (
            typeInput.includes("育児") ||
            typeInput.includes("子供") ||
            typeInput.includes("子ども")
          ) {
            activityType = "childcare";
          } else if (
            typeInput.includes("高齢者") ||
            typeInput.includes("介護")
          ) {
            activityType = "eldercare";
          } else if (typeInput.includes("医療") || typeInput.includes("病院")) {
            activityType = "healthcare";
          } else if (
            typeInput.includes("家事") ||
            typeInput.includes("掃除") ||
            typeInput.includes("洗濯")
          ) {
            activityType = "household";
          } else if (
            typeInput.includes("料理") ||
            typeInput.includes("食事") ||
            typeInput.includes("調理")
          ) {
            activityType = "cooking";
          }

          updatedChatData.activityType = activityType;
          aiResponse =
            "この活動にかかった時間はどれくらいですか？（例: 1時間30分、45分など）";
          nextStage = "duration";
          break;

        case "duration":
          // 所要時間を受け取った
          const durationInput = formData.currentMessage;
          let hours = 0;
          let minutes = 0;

          // 時間の解析
          const hourMatch = durationInput.match(/(\d+)\s*時間/);
          const minuteMatch = durationInput.match(/(\d+)\s*分/);

          if (hourMatch) hours = Number.parseInt(hourMatch[1]);
          if (minuteMatch) minutes = Number.parseInt(minuteMatch[1]);

          // 数字だけの場合は分と解釈
          if (!hourMatch && !minuteMatch) {
            const numMatch = durationInput.match(/(\d+)/);
            if (numMatch) minutes = Number.parseInt(numMatch[1]);
          }

          updatedChatData.hours = hours;
          updatedChatData.minutes = minutes;
          aiResponse =
            "この活動で使用したスキルはありますか？（マルチタスク、問題解決、コミュニケーションなど、複数選択可）";
          nextStage = "skills";
          break;

        case "skills":
          // スキルを受け取った
          const skillsInput = formData.currentMessage;
          const selectedSkills = [];

          // スキルの解析
          skills.forEach((skill, index) => {
            if (skillsInput.includes(skill)) {
              selectedSkills.push(index.toString());
            }
          });

          updatedChatData.skills = selectedSkills;
          aiResponse =
            "この活動で直面した課題はありましたか？あれば教えてください。";
          nextStage = "challenges";
          break;

        case "challenges":
          // 課題を受け取った
          updatedChatData.challenges = formData.currentMessage;
          aiResponse = "その課題をどのように解決しましたか？";
          nextStage = "solutions";
          break;

        case "solutions":
          // 解決策を受け取った
          updatedChatData.solutions = formData.currentMessage;
          aiResponse =
            "情報が揃いました！以下の内容で活動を記録します：\n\n" +
            `活動タイプ: ${ACTIVITY_TYPES[updatedChatData.activityType]}\n` +
            `説明: ${updatedChatData.description}\n` +
            `所要時間: ${updatedChatData.hours}時間${updatedChatData.minutes}分\n` +
            `スキル: ${updatedChatData.skills.map((s) => skills[Number.parseInt(s)]).join(", ")}\n\n` +
            "「活動を保存」ボタンをクリックして記録を完了してください。";
          nextStage = "complete";
          break;

        default:
          aiResponse =
            "すみません、何か問題が発生しました。もう一度お試しください。";
      }

      // AIの返信をチャット履歴に追加
      const aiMessage = { sender: "ai", text: aiResponse };
      const newHistory = [...updatedHistory, aiMessage];

      // 状態を更新
      setFormData((prev) => ({
        ...prev,
        chatHistory: newHistory,
        isAiTyping: false,
        chatStage: nextStage,
        chatData: updatedChatData,
        chatComplete: nextStage === "complete",
      }));
    }, 1000); // AIの返信の遅延をシミュレート
  };

  // チャットフォームの送信処理
  const handleChatFormSubmit = () => {
    // チャットで収集したデータをフォームデータに反映
    setFormData((prev) => ({
      ...prev,
      activityType: prev.chatData.activityType,
      description: prev.chatData.description,
      hours: prev.chatData.hours,
      minutes: prev.chatData.minutes,
      skills: prev.chatData.skills,
      challenges: prev.chatData.challenges,
      solutions: prev.chatData.solutions,
    }));

    // 通常のフォーム送信と同じ処理を実行
    setIsSubmitting(true);

    // 実際のアプリケーションではここでAPIリクエストを行います
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "活動が記録されました",
        description:
          "あなたの活動が正常に記録されました。AIがスキルを分析しています。",
        action: (
          <ToastAction altText="活動一覧を見る">活動一覧を見る</ToastAction>
        ),
      });

      // 活動一覧ページにリダイレクト
      router.push("/activities");
    }, 1500);
  };

  const skills = [
    "マルチタスク",
    "問題解決",
    "コミュニケーション",
    "感情的サポート",
    "時間管理",
    "対立解決",
    "危機管理",
    "忍耐力",
    "適応力",
    "調整力",
    "交渉力",
    "教育力",
  ];

  // 時間文字列をhとminに変換する関数
  const parseDuration = (durationStr) => {
    const hourMatch = durationStr.match(/(\d+)h/);
    const minMatch = durationStr.match(/(\d+)min/);

    const hours = hourMatch ? Number.parseInt(hourMatch[1]) : 0;
    const minutes = minMatch ? Number.parseInt(minMatch[1]) : 0;

    return { hours, minutes };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto py-4 px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/activities"
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-lg font-bold text-gray-900">ケア活動を記録</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="voice-text">音声/テキスト入力</TabsTrigger>
              <TabsTrigger value="manual-form">チャットで記録</TabsTrigger>
              {showConfirmation && (
                <TabsTrigger value="confirmation" className="hidden">
                  確認
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="voice-text">
              <Card>
                <CardHeader>
                  <CardTitle>今日の活動を教えてください</CardTitle>
                  <CardDescription>
                    自然な言葉で今日のケア活動を話したり、書いたりしてください。AIが自動的に分析します。
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>今日の活動</Label>
                      <div className="relative">
                        <Textarea
                          value={transcript}
                          onChange={(e) => setTranscript(e.target.value)}
                          placeholder="例: 今日は子どもの送り迎えをして、夕食作って介護施設に電話しました"
                          className="min-h-[150px] pr-12"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant={isRecording ? "destructive" : "outline"}
                          className="absolute right-2 top-2"
                          onClick={toggleRecording}
                          disabled={!recognitionRef.current}
                        >
                          {isRecording ? (
                            <MicOff size={18} />
                          ) : (
                            <Mic size={18} />
                          )}
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">
                        {isRecording
                          ? "🔴 録音中... 話してください"
                          : "🎤 ボタンをクリックして音声入力を開始"}
                      </p>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                      >
                        キャンセル
                      </Button>
                      <Button
                        type="button"
                        className="bg-rose-600 hover:bg-rose-700"
                        onClick={analyzeActivity}
                        disabled={isAnalyzing || !transcript.trim()}
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            分析中...
                          </>
                        ) : (
                          "活動を分析"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manual-form">
              <Card>
                <CardHeader>
                  <CardTitle>チャットで活動を記録</CardTitle>
                  <CardDescription>
                    会話形式でケア活動を記録します。質問に答えるだけで簡単に記録できます。
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-col space-y-4 max-h-[400px] overflow-y-auto p-2">
                      {/* AIのメッセージ */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                          <Brain size={16} />
                        </div>
                        <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                          <p className="text-gray-800">
                            今日はどのようなケア活動をされましたか？簡単に教えてください。
                          </p>
                        </div>
                      </div>

                      {/* チャット履歴を表示 */}
                      {formData.chatHistory &&
                        formData.chatHistory.map((message, index) => (
                          <div
                            key={index}
                            className={`flex items-start gap-3 ${message.sender === "user" ? "justify-end" : ""}`}
                          >
                            {message.sender === "ai" && (
                              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                                <Brain size={16} />
                              </div>
                            )}
                            <div
                              className={`rounded-lg p-3 max-w-[80%] ${
                                message.sender === "user"
                                  ? "bg-rose-600 text-white ml-auto"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              <p>{message.text}</p>
                            </div>
                            {message.sender === "user" && (
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                <span className="text-xs font-medium">佐</span>
                              </div>
                            )}
                          </div>
                        ))}

                      {/* 入力中表示 */}
                      {formData.isAiTyping && (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                            <Brain size={16} />
                          </div>
                          <div className="bg-gray-100 rounded-lg p-3">
                            <div className="flex space-x-1">
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0ms" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "150ms" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "300ms" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 入力フォーム */}
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        placeholder="メッセージを入力..."
                        value={formData.currentMessage}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            currentMessage: e.target.value,
                          }));
                        }}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            formData.currentMessage.trim()
                          ) {
                            e.preventDefault();
                            handleChatSubmit();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        size="icon"
                        className="bg-rose-600 hover:bg-rose-700"
                        onClick={handleChatSubmit}
                        disabled={!formData.currentMessage.trim()}
                      >
                        <ArrowRight size={18} />
                      </Button>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                      >
                        キャンセル
                      </Button>
                      <div className="text-xs text-gray-500 flex items-center">
                        <MessageSquare size={12} className="mr-1" />
                        AIチャットで記録中
                      </div>
                      <Button
                        type="button"
                        className="bg-rose-600 hover:bg-rose-700"
                        disabled={!formData.chatComplete}
                        onClick={handleChatFormSubmit}
                      >
                        {isSubmitting ? "保存中..." : "活動を保存"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="confirmation">
              <Card>
                <CardHeader>
                  <CardTitle>活動の確認</CardTitle>
                  <CardDescription>
                    AIが分析した活動内容を確認し、必要に応じて編集してください。
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-700 mb-2">
                        元のテキスト:
                      </h3>
                      <p className="text-gray-600">{transcript}</p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">
                        分析された活動:
                      </h3>

                      {analyzedActivities.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-500">
                            活動が見つかりませんでした。別の表現で試してみてください。
                          </p>
                        </div>
                      ) : (
                        analyzedActivities.map((activity, index) => {
                          const { hours, minutes } = parseDuration(
                            activity.duration
                          );

                          return (
                            <div
                              key={index}
                              className="border border-gray-200 rounded-lg p-4 relative"
                            >
                              <div className="absolute top-2 right-2 flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => {
                                    // 編集モードの切り替えロジックをここに実装
                                  }}
                                >
                                  <Edit size={15} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-red-500 hover:text-red-700"
                                  onClick={() => removeActivity(index)}
                                >
                                  <X size={15} />
                                </Button>
                              </div>

                              <div className="mb-3">
                                <Badge
                                  className={
                                    TYPE_COLORS[activity.type] ||
                                    TYPE_COLORS.other
                                  }
                                >
                                  {ACTIVITY_TYPES[activity.type] || "その他"}
                                </Badge>
                              </div>

                              <div className="space-y-3">
                                <div>
                                  <Label className="text-xs text-gray-500">
                                    活動内容
                                  </Label>
                                  <div className="flex items-start gap-2">
                                    <Textarea
                                      value={activity.description}
                                      onChange={(e) =>
                                        editActivity(
                                          index,
                                          "description",
                                          e.target.value
                                        )
                                      }
                                      className="mt-1"
                                    />
                                  </div>
                                </div>

                                <div className="flex items-center gap-4">
                                  <div>
                                    <Label className="text-xs text-gray-500">
                                      所要時間
                                    </Label>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Input
                                        type="number"
                                        value={hours}
                                        onChange={(e) => {
                                          const newHours =
                                            Number.parseInt(e.target.value) ||
                                            0;
                                          editActivity(
                                            index,
                                            "duration",
                                            `${newHours}h ${minutes}min`
                                          );
                                        }}
                                        min="0"
                                        max="24"
                                        className="w-16"
                                      />
                                      <span>時間</span>
                                      <Input
                                        type="number"
                                        value={minutes}
                                        onChange={(e) => {
                                          const newMinutes =
                                            Number.parseInt(e.target.value) ||
                                            0;
                                          editActivity(
                                            index,
                                            "duration",
                                            `${hours}h ${newMinutes}min`
                                          );
                                        }}
                                        min="0"
                                        max="59"
                                        className="w-16"
                                      />
                                      <span>分</span>
                                    </div>
                                  </div>

                                  <div>
                                    <Label className="text-xs text-gray-500">
                                      活動タイプ
                                    </Label>
                                    <Select
                                      value={activity.type}
                                      onValueChange={(value) =>
                                        editActivity(index, "type", value)
                                      }
                                    >
                                      <SelectTrigger className="mt-1 w-[180px]">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Object.entries(ACTIVITY_TYPES).map(
                                          ([value, label]) => (
                                            <SelectItem
                                              key={value}
                                              value={value}
                                            >
                                              {label}
                                            </SelectItem>
                                          )
                                        )}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div className="pt-4 flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setActiveTab("voice-text");
                          setShowConfirmation(false);
                        }}
                      >
                        戻る
                      </Button>
                      <div className="text-xs text-gray-500 flex items-center">
                        <Brain size={12} className="mr-1" />
                        AI分析で記録中
                      </div>
                      <Button
                        type="button"
                        className="bg-rose-600 hover:bg-rose-700"
                        onClick={saveActivities}
                        disabled={
                          isSubmitting || analyzedActivities.length === 0
                        }
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            保存中...
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            活動を保存
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
