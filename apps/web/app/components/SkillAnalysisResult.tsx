"use client";

import { Badge } from "@workspace/ui/components/badge";

export interface SkillAnalysis {
  name: string;
  tendency: string;
  relevance: string;
  reason: string;
}

export interface ResumeExample {
  text: string;
}

interface SkillAnalysisResultProps {
  skills: SkillAnalysis[];
  resumeExamples: ResumeExample[];
  activityDescription: string;
}

export default function SkillAnalysisResult({
  skills,
  resumeExamples,
  activityDescription,
}: SkillAnalysisResultProps) {
  // 発揮傾向に応じたカラーマッピング
  const getTendencyColor = (tendency: string) => {
    switch (tendency) {
      case "強く見られる":
        return "bg-green-50 text-green-700 border-green-200";
      case "よく見られる":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "少し見られる":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // 関連性に応じたカラーマッピング
  const getRelevanceColor = (relevance: string) => {
    switch (relevance) {
      case "高い":
        return "bg-red-50 text-red-700 border-red-200";
      case "中程度":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "低い":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h5 className="text-sm font-medium text-gray-900 mb-2">
          検出されたスキル
        </h5>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge key={index} variant="outline" className="bg-white">
              {skill.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h5 className="text-sm font-medium text-gray-900 mb-3">
          詳細な分析結果:
        </h5>
        {skills.map((skill, index) => (
          <div
            key={index}
            className="mb-4 border border-gray-100 rounded-md p-3 bg-gray-50"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <h6 className="font-medium">{skill.name}</h6>
              <div className="flex gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getTendencyColor(
                    skill.tendency
                  )}`}
                >
                  {skill.tendency}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getRelevanceColor(
                    skill.relevance
                  )}`}
                >
                  関連性: {skill.relevance}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600">{skill.reason}</p>
          </div>
        ))}
      </div>

      <div>
        <h5 className="text-sm font-medium text-gray-900 mb-3">
          キャリアアピールポイント:
        </h5>
        <ul className="list-disc pl-5 space-y-2">
          {resumeExamples.map((example, index) => (
            <li key={index} className="text-sm text-gray-800">
              {example.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
