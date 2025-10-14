import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Globe, 
  CheckCircle, 
  AlertTriangle,
  Target,
  Building,
  Users
} from 'lucide-react';

export function LocationJobFilter({ 
  onLocationChange, 
  selectedLocation = 'India',
  className = '' 
}) {
  const [currentLocation, setCurrentLocation] = useState(selectedLocation);

  const locations = [
    {
      value: 'India',
      label: 'India',
      flag: '🇮🇳',
      description: 'Jobs from Indian companies and MNCs in India',
      companies: ['TCS', 'Infosys', 'Flipkart', 'Paytm', 'Zomato'],
      salaryRange: '₹4-25 LPA',
      jobCount: '50,000+'
    },
    {
      value: 'United States',
      label: 'United States',
      flag: '🇺🇸',
      description: 'Jobs from US companies and global remote positions',
      companies: ['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta'],
      salaryRange: '$70k-$200k',
      jobCount: '100,000+'
    },
    {
      value: 'Global Remote',
      label: 'Global Remote',
      flag: '🌍',
      description: 'Remote jobs from companies worldwide',
      companies: ['GitLab', 'Buffer', 'Zapier', 'Toptal', 'Remote.co'],
      salaryRange: '$50k-$180k',
      jobCount: '25,000+'
    },
    {
      value: 'Europe',
      label: 'Europe',
      flag: '🇪🇺',
      description: 'Jobs from European companies and startups',
      companies: ['SAP', 'Spotify', 'Klarna', 'Revolut', 'N26'],
      salaryRange: '€40k-€120k',
      jobCount: '30,000+'
    }
  ];

  const handleLocationChange = (newLocation) => {
    setCurrentLocation(newLocation);
    onLocationChange(newLocation);
  };

  const selectedLocationData = locations.find(loc => loc.value === currentLocation);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Job Location Preference
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Location Selector */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Select your preferred job location:</label>
          <Select value={currentLocation} onValueChange={handleLocationChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.value} value={location.value}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{location.flag}</span>
                    <span>{location.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Location Details */}
        {selectedLocationData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{selectedLocationData.flag}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      {selectedLocationData.label} Jobs
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {selectedLocationData.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                        <Building className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                        <div className="text-sm font-medium">Salary Range</div>
                        <div className="text-xs text-muted-foreground">
                          {selectedLocationData.salaryRange}
                        </div>
                      </div>
                      
                      <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                        <Target className="w-5 h-5 mx-auto mb-1 text-green-500" />
                        <div className="text-sm font-medium">Available Jobs</div>
                        <div className="text-xs text-muted-foreground">
                          {selectedLocationData.jobCount}
                        </div>
                      </div>
                      
                      <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                        <Users className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                        <div className="text-sm font-medium">Top Companies</div>
                        <div className="text-xs text-muted-foreground">
                          {selectedLocationData.companies.length}+ companies
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Top Companies:</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedLocationData.companies.map((company, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {company}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* India-Specific Alert */}
        {currentLocation === 'India' && (
          <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <strong>Perfect for Indian job seekers!</strong> You'll see jobs from:
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Major Indian IT companies (TCS, Infosys, Wipro)</li>
                <li>• Indian startups and unicorns (Flipkart, Paytm, Zomato)</li>
                <li>• MNC offices in Indian cities</li>
                <li>• Remote positions available for Indian candidates</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Regional Restrictions Info */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Why location matters:</strong> Many job boards restrict access by region. 
            By selecting your location, we show you jobs that are actually accessible and 
            relevant to your market, with appropriate salary ranges and local companies.
          </AlertDescription>
        </Alert>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleLocationChange('India')}
            className={currentLocation === 'India' ? 'bg-green-100 border-green-300' : ''}
          >
            🇮🇳 India Jobs
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleLocationChange('Global Remote')}
            className={currentLocation === 'Global Remote' ? 'bg-blue-100 border-blue-300' : ''}
          >
            🌍 Remote Jobs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default LocationJobFilter;