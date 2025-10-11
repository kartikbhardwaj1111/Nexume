# AI Service Manager Tests

This directory contains comprehensive unit tests for the AI Service Manager and related components.

## Test Coverage

### AIServiceManager.test.js
- **Service Initialization**: Tests proper initialization of services and fallback systems
- **Service Failover Mechanisms**: Tests automatic failover between HuggingFace, OpenAI, and rule-based scoring
- **Service Health Monitoring**: Tests availability checks and service status monitoring
- **Rule-based Scoring Accuracy**: Tests the accuracy of the fallback scoring system
- **HuggingFace Integration**: Tests API integration and response handling
- **OpenAI Integration**: Tests placeholder implementation
- **Basic Content Analysis**: Tests ultimate fallback scoring
- **Content Analysis**: Tests resume and job description parsing
- **Error Handling**: Tests graceful error handling and recovery

### ContentAnalysisEngine.test.js
- **Initialization**: Tests proper setup of skills database and keywords
- **Skills Analysis**: Tests skill extraction and matching algorithms
- **Experience Analysis**: Tests experience level detection and quality assessment
- **Education Analysis**: Tests education level and certification detection
- **Formatting Analysis**: Tests ATS compatibility and structure analysis
- **Keyword Analysis**: Tests keyword optimization and matching
- **Industry Analysis**: Tests industry detection and alignment
- **Comprehensive Analysis**: Tests end-to-end analysis workflow
- **Edge Cases**: Tests handling of empty inputs and edge conditions

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

## Test Requirements Covered

✅ **Service Failover Mechanisms**
- Tests automatic failover between AI services
- Tests graceful degradation to rule-based scoring
- Tests ultimate fallback to basic content analysis

✅ **Rule-based Scoring Accuracy**
- Tests enhanced content analysis engine integration
- Tests fallback to basic scoring when enhanced engine fails
- Tests accuracy of skill matching, experience calculation, and education scoring

✅ **Service Health Monitoring**
- Tests HuggingFace API availability checks
- Tests service status updates during analysis
- Tests error handling for network issues and API failures

## Mock Strategy

The tests use comprehensive mocking to:
- Mock external API calls (HuggingFace, OpenAI)
- Mock the ContentAnalysisEngine for isolated testing
- Mock network conditions to test error scenarios
- Provide predictable test data for consistent results

## Test Data

Tests use realistic resume and job description samples to ensure:
- Accurate skill extraction testing
- Proper experience level detection
- Correct education and certification parsing
- Realistic formatting analysis scenarios