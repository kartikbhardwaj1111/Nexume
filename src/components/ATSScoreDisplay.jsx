import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, XCircle, TrendingUp, Sparkles, Target, Award, Zap } from 'lucide-react';

export default function ATSScoreDisplay({ scoreData }) {
  if (!scoreData) return null;

  const { overall_score, confidence, pillars, recommendations } = scoreData;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (score >= 60) return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-green-500/20 to-cyan-500/20 rounded-full blur-3xl"
          animate={{ rotate: -360, scale: [1.2, 1, 1.2] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 relative z-10"
      >
        {/* Overall Score - Enhanced */}
        <motion.div variants={itemVariants}>
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-background/80 to-primary/5 backdrop-blur-sm shadow-2xl overflow-hidden relative">
            {/* Animated Border */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-green-500/20"
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ backgroundSize: '200% 200%' }}
            />
            
            <CardHeader className="text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-8 h-8 text-yellow-500" />
                  </motion.div>
                  ATS Compatibility Score
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {getScoreIcon(overall_score)}
                  </motion.div>
                </CardTitle>
              </motion.div>
            </CardHeader>
            
            <CardContent className="text-center pb-8 relative z-10">
              {/* Circular Progress Ring */}
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle
                    cx="50" cy="50" r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted-foreground/20"
                  />
                  {/* Progress Circle */}
                  <motion.circle
                    cx="50" cy="50" r="40"
                    stroke="url(#scoreGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - overall_score / 100) }}
                    transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={overall_score >= 80 ? "#10b981" : overall_score >= 60 ? "#f59e0b" : "#ef4444"} />
                      <stop offset="100%" stopColor={overall_score >= 80 ? "#06d6a0" : overall_score >= 60 ? "#fbbf24" : "#f87171"} />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Score Number */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    className={`text-5xl font-bold ${getScoreColor(overall_score)}`}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                  >
                    <CountUp end={overall_score} duration={2} delay={0.8} />
                  </motion.div>
                  <motion.div
                    className="text-lg text-muted-foreground font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    / 100
                  </motion.div>
                </div>
              </div>
              
              {/* Score Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="space-y-4"
              >
                <Badge 
                  variant={overall_score >= 80 ? "default" : overall_score >= 60 ? "secondary" : "destructive"}
                  className="px-6 py-2 text-lg font-semibold"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center gap-2"
                  >
                    <Target className="w-4 h-4" />
                    Confidence: <CountUp end={Math.round(confidence * 100)} duration={1.5} delay={1.5} />%
                  </motion.div>
                </Badge>
                
                <motion.div
                  className={`text-xl font-semibold ${overall_score >= 80 ? 'text-green-500' : overall_score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {overall_score >= 80 ? '🎉 Excellent Match!' : overall_score >= 60 ? '⚡ Good Potential' : '🔧 Needs Improvement'}
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pillar Breakdown - Enhanced */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-background/90 to-secondary/10 backdrop-blur-sm border border-primary/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                </motion.div>
                Detailed Score Analysis
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Award className="w-5 h-5 text-yellow-500" />
                </motion.div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Core Skills - Enhanced */}
              <motion.div 
                className="space-y-4 p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20"
                whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(59, 130, 246, 0.2)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="p-2 bg-blue-500/20 rounded-full"
                    >
                      <Zap className="w-5 h-5 text-blue-500" />
                    </motion.div>
                    <span className="font-semibold text-lg">Core Skills Alignment</span>
                  </div>
                  <motion.span 
                    className={`font-bold text-xl ${getScoreColor(pillars.core_skills.score)}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <CountUp end={pillars.core_skills.score} duration={1.5} delay={0.5} />/40
                  </motion.span>
                </div>
                
                <div className="relative">
                  <Progress value={(pillars.core_skills.score / 40) * 100} className="h-3 bg-blue-100/20" />
                  <motion.div
                    className="absolute top-0 left-0 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(pillars.core_skills.score / 40) * 100}%` }}
                    transition={{ duration: 2, delay: 0.5 }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Matched: <span className="font-semibold text-blue-400">{pillars.core_skills.matched.length}</span> / {pillars.core_skills.required_count} skills
                  </span>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-blue-400 font-medium"
                  >
                    {Math.round((pillars.core_skills.matched.length / pillars.core_skills.required_count) * 100) || 0}%
                  </motion.div>
                </div>
                
                {pillars.core_skills.matched.length > 0 && (
                  <motion.div 
                    className="flex flex-wrap gap-2 mt-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    {pillars.core_skills.matched.map((skillData, index) => {
                      // Handle both old format (string) and new format (object)
                      const skill = typeof skillData === 'string' ? skillData : skillData.skill;
                      const matchType = typeof skillData === 'object' ? skillData.match_type : 'exact';
                      const evidence = typeof skillData === 'object' ? skillData.evidence : [];
                      
                      const getMatchIcon = (type) => {
                        switch(type) {
                          case 'exact': return '✓';
                          case 'fuzzy': return '≈';
                          case 'weak': return '~';
                          default: return '✓';
                        }
                      };

                      const getMatchColor = (type) => {
                        switch(type) {
                          case 'exact': return 'bg-green-500/10 border-green-500/30 text-green-400';
                          case 'fuzzy': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
                          case 'weak': return 'bg-orange-500/10 border-orange-500/30 text-orange-400';
                          default: return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
                        }
                      };

                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1 + index * 0.1 }}
                          whileHover={{ scale: 1.1 }}
                          title={evidence.length > 0 ? `Found in: ${evidence.join(', ')}` : ''}
                        >
                          <Badge 
                            variant="outline" 
                            className={`text-xs hover:bg-opacity-20 ${getMatchColor(matchType)}`}
                          >
                            {getMatchIcon(matchType)} {skill}
                          </Badge>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </motion.div>

              {/* Experience - Enhanced */}
              <motion.div 
                className="space-y-4 p-6 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20"
                whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(34, 197, 94, 0.2)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="p-2 bg-green-500/20 rounded-full"
                    >
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </motion.div>
                    <span className="font-semibold text-lg">Relevant Experience</span>
                  </div>
                  <motion.span 
                    className={`font-bold text-xl ${getScoreColor(pillars.relevant_experience.score)}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                  >
                    <CountUp end={pillars.relevant_experience.score} duration={1.5} delay={0.6} />/30
                  </motion.span>
                </div>
                
                <div className="relative">
                  <Progress value={(pillars.relevant_experience.score / 30) * 100} className="h-3 bg-green-100/20" />
                  <motion.div
                    className="absolute top-0 left-0 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(pillars.relevant_experience.score / 30) * 100}%` }}
                    transition={{ duration: 2, delay: 0.6 }}
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Experience: <span className="font-semibold text-green-400">{pillars.relevant_experience.candidate_years}</span> years 
                      (Required: <span className="font-semibold">{pillars.relevant_experience.jd_years}</span>)
                    </span>
                    <motion.div
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-green-400 font-medium"
                    >
                      {pillars.relevant_experience.candidate_years >= pillars.relevant_experience.jd_years ? '✓ Qualified' : '⚠ Below Req.'}
                    </motion.div>
                  </div>
                  
                  {pillars.relevant_experience.evidence && pillars.relevant_experience.evidence.length > 0 && (
                    <motion.div 
                      className="text-xs text-muted-foreground bg-green-500/5 p-3 rounded-lg border border-green-500/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                    >
                      <div className="font-medium text-green-400 mb-2">📋 Experience Evidence:</div>
                      <div className="space-y-1">
                        {pillars.relevant_experience.evidence.slice(0, 3).map((evidence, index) => (
                          <div key={index} className="truncate">
                            • {evidence.length > 100 ? evidence.substring(0, 100) + '...' : evidence}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Tools - Enhanced */}
              <motion.div 
                className="space-y-4 p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20"
                whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(168, 85, 247, 0.2)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 180, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="p-2 bg-purple-500/20 rounded-full"
                    >
                      <Sparkles className="w-5 h-5 text-purple-500" />
                    </motion.div>
                    <span className="font-semibold text-lg">Tools & Methodologies</span>
                  </div>
                  <motion.span 
                    className={`font-bold text-xl ${getScoreColor(pillars.tools_methodologies.score)}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    <CountUp end={pillars.tools_methodologies.score} duration={1.5} delay={0.7} />/20
                  </motion.span>
                </div>
                
                <div className="relative">
                  <Progress value={(pillars.tools_methodologies.score / 20) * 100} className="h-3 bg-purple-100/20" />
                  <motion.div
                    className="absolute top-0 left-0 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(pillars.tools_methodologies.score / 20) * 100}%` }}
                    transition={{ duration: 2, delay: 0.7 }}
                  />
                </div>
                
                {pillars.tools_methodologies.matched.length > 0 && (
                  <motion.div 
                    className="flex flex-wrap gap-2 mt-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    {pillars.tools_methodologies.matched.map((tool, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2 + index * 0.1 }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Badge variant="outline" className="text-xs bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20">
                          🛠️ {tool}
                        </Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>

              {/* Education - Enhanced */}
              <motion.div 
                className="space-y-4 p-6 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20"
                whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(249, 115, 22, 0.2)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="p-2 bg-orange-500/20 rounded-full"
                    >
                      <Award className="w-5 h-5 text-orange-500" />
                    </motion.div>
                    <span className="font-semibold text-lg">Education & Credentials</span>
                  </div>
                  <motion.span 
                    className={`font-bold text-xl ${getScoreColor(pillars.education_credentials.score)}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                  >
                    <CountUp end={pillars.education_credentials.score} duration={1.5} delay={0.8} />/10
                  </motion.span>
                </div>
                
                <div className="relative">
                  <Progress value={(pillars.education_credentials.score / 10) * 100} className="h-3 bg-orange-100/20" />
                  <motion.div
                    className="absolute top-0 left-0 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(pillars.education_credentials.score / 10) * 100}%` }}
                    transition={{ duration: 2, delay: 0.8 }}
                  />
                </div>
                
                <motion.div 
                  className="text-sm text-muted-foreground bg-orange-500/5 p-3 rounded-lg border border-orange-500/10 space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                >
                  <div className="font-medium text-orange-400">📚 {pillars.education_credentials.degree}</div>
                  {pillars.education_credentials.notes && (
                    <div className="text-xs text-muted-foreground">
                      {pillars.education_credentials.notes}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Only show errors if they are user-actionable, not technical issues */}
        {scoreData.errors && scoreData.errors.length > 0 && scoreData.errors.some(error => 
          error.includes('API key') || error.includes('resume') || error.includes('job description')
        ) && (
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <AlertCircle className="w-6 h-6 text-yellow-500" />
                  </motion.div>
                  Suggestions for Better Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {scoreData.errors.filter(error => 
                    error.includes('API key') || error.includes('resume') || error.includes('job description')
                  ).map((error, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{error}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Recommendations - Enhanced */}
        {recommendations && recommendations.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <AlertCircle className="w-6 h-6 text-yellow-500" />
                  </motion.div>
                  Smart Improvement Recommendations
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Target className="w-5 h-5 text-orange-500" />
                  </motion.div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-yellow-500/5 to-orange-500/5 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300"
                      initial={{ opacity: 0, x: -30, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.2, type: "spring" }}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="p-2 bg-yellow-500/20 rounded-full flex-shrink-0"
                      >
                        <Zap className="w-4 h-4 text-yellow-500" />
                      </motion.div>
                      <div className="flex-1">
                        <motion.span 
                          className="text-sm font-medium text-foreground"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.7 + index * 0.2 }}
                        >
                          {rec}
                        </motion.span>
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                        className="text-orange-500 font-bold text-xs"
                      >
                        #{index + 1}
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}