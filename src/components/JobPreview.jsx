import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Building,
  MapPin,
  DollarSign,
  Clock,
  GraduationCap,
  CheckCircle,
  AlertTriangle,
  Pencil,
  Eye
} from 'lucide-react';

const JobPreview = ({ 
  jobData, 
  onConfirm, 
  onEdit, 
  isLoading = false,
  showActions = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!jobData) {
    return (
      <Alert>
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertDescription>No job data available to preview</AlertDescription>
      </Alert>
    );
  }

  const { data, method, confidence, validation } = jobData;

  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    
    if (salary.min && salary.max) {
      return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()} ${salary.period || 'yearly'}`;
    }
    
    return 'Salary information available';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMethodBadgeVariant = (method) => {
    switch (method) {
      case 'ai': return 'default';
      case 'css': return 'secondary';
      case 'manual': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Job Preview
            </CardTitle>
            <CardDescription>
              Review the extracted job details before proceeding with analysis
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={getMethodBadgeVariant(method)}>
              {method === 'ai' ? 'AI Extracted' : 
               method === 'css' ? 'Auto Extracted' : 
               'Manual Input'}
            </Badge>
            {confidence > 0 && (
              <Badge variant="outline" className={getConfidenceColor(confidence)}>
                {Math.round(confidence * 100)}% confidence
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Basic Job Information */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{data.title}</h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building className="h-4 w-4" />
                <span>{data.company}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{data.location}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{data.experienceYears} years experience required</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                <span>{data.education}</span>
              </div>
              {data.salary && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>{formatSalary(data.salary)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Work Type and Employment Type */}
          <div className="flex gap-2 flex-wrap">
            {data.workType && (
              <Badge variant="secondary">{data.workType}</Badge>
            )}
            {data.employmentType && (
              <Badge variant="secondary">{data.employmentType}</Badge>
            )}
          </div>
        </div>

        <Separator />

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Required Skills ({data.skills.length})</h4>
            <div className="flex flex-wrap gap-2">
              {data.skills.slice(0, isExpanded ? data.skills.length : 10).map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {data.skills.length > 10 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-6 px-2 text-xs"
                >
                  {isExpanded ? 'Show less' : `+${data.skills.length - 10} more`}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Requirements */}
        {data.requirements && data.requirements.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Key Requirements ({data.requirements.length})</h4>
            <ul className="space-y-1">
              {data.requirements.slice(0, isExpanded ? data.requirements.length : 5).map((req, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
              {data.requirements.length > 5 && !isExpanded && (
                <li>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(true)}
                    className="h-6 px-2 text-xs"
                  >
                    +{data.requirements.length - 5} more requirements
                  </Button>
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Responsibilities */}
        {data.responsibilities && data.responsibilities.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Key Responsibilities ({data.responsibilities.length})</h4>
            <ul className="space-y-1">
              {data.responsibilities.slice(0, isExpanded ? data.responsibilities.length : 3).map((resp, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></span>
                  <span>{resp}</span>
                </li>
              ))}
              {data.responsibilities.length > 3 && !isExpanded && (
                <li>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(true)}
                    className="h-6 px-2 text-xs"
                  >
                    +{data.responsibilities.length - 3} more responsibilities
                  </Button>
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Benefits */}
        {data.benefits && data.benefits.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Benefits & Perks</h4>
            <div className="flex flex-wrap gap-2">
              {data.benefits.map((benefit, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {benefit}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Validation Warnings */}
        {validation && !validation.isValid && (
          <Alert className="border-yellow-500">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">Data Quality Issues:</p>
                <ul className="text-sm space-y-1">
                  {validation.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
                <p className="text-xs mt-2">
                  You can still proceed, but consider editing the job details for better analysis results.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Extraction Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Extraction method: {method}</p>
          {data.extractedAt && (
            <p>Extracted: {new Date(data.extractedAt).toLocaleString()}</p>
          )}
          {data.url && (
            <p className="truncate">Source: {data.url}</p>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={() => onConfirm?.(jobData)}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Processing...' : 'Confirm & Analyze Resume'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onEdit?.(jobData)}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit Details
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobPreview;