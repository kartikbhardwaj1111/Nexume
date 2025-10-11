import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  EyeOff, 
  FileText, 
  CheckCircle, 
  Target, 
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';

export default function ReportPreview({ scoreData }) {
  const [showPreview, setShowPreview] = useState(false);

  if (!scoreData) return null;

  const { overall_score, pillars, recommendations } = scoreData;

  const getScoreLevel = (score) => {
    if (score >= 80) return { level: 'Excellent', color: 'green', emoji: '🎉' };
    if (score >= 70) return { level: 'Good', color: 'blue', emoji: '👍' };
    if (score >= 60) return { level: 'Fair', color: 'yellow', emoji: '⚡' };
    return { level: 'Needs Improvement', color: 'red', emoji: '🔧' };
  };

  const scoreLevel = getScoreLevel(overall_score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-6"
    >
      <Card className="border-dashed border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Report Preview
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="text-blue-600 hover:text-blue-700"
            >
              {showPreview ? (
                <>
                  <EyeOff className="w-4 h-4 mr-1" />
                  Hide
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="pt-0">
                <div className="space-y-4 text-sm">
                  {/* Executive Summary Preview */}
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      Executive Summary
                    </h4>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={`bg-${scoreLevel.color}-100 text-${scoreLevel.color}-800 border-${scoreLevel.color}-200`}>
                        {overall_score}/100 {scoreLevel.emoji}
                      </Badge>
                      <span className="text-muted-foreground">
                        {scoreLevel.level} ATS Compatibility
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Your resume scored {overall_score} out of 100 on our ATS compatibility analysis...
                    </p>
                  </div>

                  {/* Score Breakdown Preview */}
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      Score Breakdown
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex justify-between">
                        <span>Core Skills:</span>
                        <span className="font-medium">{pillars.core_skills.score}/40</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Experience:</span>
                        <span className="font-medium">{pillars.relevant_experience.score}/30</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tools:</span>
                        <span className="font-medium">{pillars.tools_methodologies.score}/20</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Education:</span>
                        <span className="font-medium">{pillars.education_credentials.score}/10</span>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations Preview */}
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-600" />
                      Top Recommendations
                    </h4>
                    <div className="space-y-2">
                      {recommendations.slice(0, 3).map((rec, index) => (
                        <div key={index} className="flex items-start gap-2 text-xs">
                          <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{rec}</span>
                        </div>
                      ))}
                      {recommendations.length > 3 && (
                        <div className="text-xs text-muted-foreground italic">
                          + {recommendations.length - 3} more recommendations...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Plan Preview */}
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Award className="w-4 h-4 text-purple-600" />
                      Action Plan Sections
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                        <div className="font-medium text-red-700 dark:text-red-300">🔥 High Impact</div>
                        <div className="text-red-600 dark:text-red-400">Immediate changes</div>
                      </div>
                      <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                        <div className="font-medium text-yellow-700 dark:text-yellow-300">📈 Medium Impact</div>
                        <div className="text-yellow-600 dark:text-yellow-400">Strategic improvements</div>
                      </div>
                      <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                        <div className="font-medium text-green-700 dark:text-green-300">✨ Polish</div>
                        <div className="text-green-600 dark:text-green-400">Final optimizations</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <p className="text-xs text-muted-foreground">
                      📄 Full report includes detailed analysis, checklists, and step-by-step improvement guide
                    </p>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}