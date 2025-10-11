import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Plus, Eye, Calendar, Target, Award, Users } from 'lucide-react';
import { analyticsStorage } from '@/lib/analyticsStorage';

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [showAddApplication, setShowAddApplication] = useState(false);
  const [newApplication, setNewApplication] = useState({
    company: '',
    position: '',
    status: 'applied',
    resumeVersion: '',
    applicationDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    const data = analyticsStorage.calculateAnalytics();
    setAnalytics(data);
  };

  const handleAddApplication = () => {
    analyticsStorage.saveApplication(newApplication);
    setNewApplication({
      company: '',
      position: '',
      status: 'applied',
      resumeVersion: '',
      applicationDate: new Date().toISOString().split('T')[0]
    });
    setShowAddApplication(false);
    loadAnalytics();
  };

  const updateApplicationStatus = (id, status) => {
    analyticsStorage.updateApplicationStatus(id, status);
    loadAnalytics();
  };

  if (!analytics) return <div>Loading analytics...</div>;

  const statusColors = {
    applied: '#6b7280',
    interview: '#3b82f6',
    offer: '#10b981',
    rejected: '#ef4444'
  };

  const pieData = [
    { name: 'Applied', value: analytics.totalApplications - analytics.responses, color: '#6b7280' },
    { name: 'Interviews', value: analytics.interviews, color: '#3b82f6' },
    { name: 'Offers', value: analytics.offers, color: '#10b981' },
    { name: 'Rejected', value: analytics.responses - analytics.interviews - analytics.offers, color: '#ef4444' }
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Resume Performance Analytics</h1>
          <p className="text-muted-foreground">Track your job application success and optimize your resume strategy</p>
        </div>
        <Dialog open={showAddApplication} onOpenChange={setShowAddApplication}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-primary-glow">
              <Plus className="w-4 h-4 mr-2" />
              Add Application
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Application</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={newApplication.company}
                  onChange={(e) => setNewApplication({...newApplication, company: e.target.value})}
                  placeholder="Company name"
                />
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={newApplication.position}
                  onChange={(e) => setNewApplication({...newApplication, position: e.target.value})}
                  placeholder="Job title"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={newApplication.status} onValueChange={(value) => setNewApplication({...newApplication, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="offer">Offer</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date">Application Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newApplication.applicationDate}
                  onChange={(e) => setNewApplication({...newApplication, applicationDate: e.target.value})}
                />
              </div>
              <Button onClick={handleAddApplication} className="w-full">
                Add Application
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-700 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Total Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{analytics.totalApplications}</div>
              <p className="text-xs text-blue-600 mt-1">Applications submitted</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-700 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Response Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{analytics.responseRate.toFixed(1)}%</div>
              <p className="text-xs text-green-600 mt-1">Companies responded</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-700 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Interview Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{analytics.interviewRate.toFixed(1)}%</div>
              <p className="text-xs text-purple-600 mt-1">Interviews secured</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-orange-700 flex items-center">
                <Award className="w-4 h-4 mr-2" />
                Offer Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{analytics.offerRate.toFixed(1)}%</div>
              <p className="text-xs text-orange-600 mt-1">Job offers received</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Application Status Distribution */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle>Application Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Resume Version Performance */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardHeader>
              <CardTitle>Resume Version Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.versionPerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.versionPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="responseRate" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  <div className="text-center">
                    <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No resume versions tracked yet</p>
                    <p className="text-sm">Start analyzing resumes to see performance data</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Applications */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.recentApplications.length > 0 ? (
              <div className="space-y-4">
                {analytics.recentApplications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{app.position}</h3>
                        <Badge variant="outline">{app.company}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Applied on {new Date(app.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={app.status} onValueChange={(value) => updateApplicationStatus(app.id, value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="applied">Applied</SelectItem>
                          <SelectItem value="interview">Interview</SelectItem>
                          <SelectItem value="offer">Offer</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: statusColors[app.status] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No applications tracked yet</p>
                <p className="text-sm">Add your first application to start tracking performance</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}