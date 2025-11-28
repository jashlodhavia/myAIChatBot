/**
 * Detects if a message contains safety/hazardous/airplane critical keywords
 */
export function isSafetyRelated(text: string): boolean {
  const lowerText = text.toLowerCase();
  
  const safetyKeywords = [
    'hazard', 'hazardous', 'danger', 'dangerous',
    'safety breach', 'safety issue', 'safety problem', 'safety concern',
    'plane problem', 'aircraft problem', 'airplane issue', 'aircraft issue',
    'plane failure', 'aircraft failure', 'airplane failure',
    'emergency', 'emergency landing', 'emergency situation',
    'crash', 'accident', 'incident',
    'mechanical failure', 'engine failure', 'system failure',
    'critical check', 'safety check', 'maintenance issue',
    'unsafe', 'unsafe condition', 'unsafe situation',
    'malfunction', 'defect', 'fault',
    'airworthiness', 'airworthy',
    'aviation safety', 'flight safety',
    // Operational Safety Procedures
    'operational safety procedures', 'ground operations', 'ramp safety guidelines',
    'vehicle operations on ramp', 'speed limits', 'operational hours',
    'pre-operation inspection', 'equipment handling', 'maintenance schedule',
    'ground support equipment', 'gse', 'operator training', 'training refreshers',
    // Fueling Procedures
    'fueling procedures', 'pre-fueling checks', 'pre-fueling inspection',
    'fueling windows', 'fueling protocols', 'supervision duration',
    'emergency drill', 'spill response', 'post-fueling procedures',
    'completion reporting', 'fueling reports', 'manifest checks', 'manifest', 'screw', 'screws', 'cargo', 'cargo handling', 'loading and unloading procedures', 'verification time', 'cargo manifest checks', 'operation windows', 'hazardous materials', 'handling time', 'compliance checks', 'training frequency', 'safety and security', 'inspection frequency', 'security meetings', 'safety policy', 'review cycle', 'safety management system', 'sms', 'policy review', 'risk assessment', 'safety governance', 'committee meetings', 'safety audits', 'safety performance', 'flight operations', 'pre-flight checks', 'inspection duration', 'walk-around inspection', 'checklists', 'in-flight protocols', 'cabin safety briefings', 'emergency exits', 'turbulence protocol', 'post-flight procedures', 'report submission', 'post-flight inspection', 'emergency response', 'emergency planning', 'drills and simulations', 'emergency readiness', 'response review meetings', 'response strategies', 'safety training', 'safety education', 'initial training program', 'recurrent training', 'specialized workshops', 'safety knowledge', 'emergency procedures', 'role-specific safety training', 'safety reporting', 'safety analysis', 'report review frequency', 'data analysis sessions', 'safety data', 'predictive analysis', 'occupational health and safety', 'workplace assessments', 'health check-ups', 'working environment', 'corrective actions', 'employee health', 'environmental compliance', 'environmental impact', 'sustainability', 'security protocol drills', 'security threats', 'security preparedness', 'policy updates', 'stakeholder feedback', 'safety improvements', 'continuous improvement', 'safety enhancement', 'broken',
    // Cargo Handling
    'cargo handling', 'loading and unloading procedures', 'verification time',
    'cargo manifest checks', 'operation windows', 'hazardous materials',
    'handling time', 'compliance checks', 'training frequency',
    'safety and security', 'inspection frequency', 'security meetings',
    // Safety Management System
    'safety policy', 'review cycle', 'safety management system', 'sms',
    'policy review', 'risk assessment', 'safety governance',
    'committee meetings', 'safety audits', 'safety performance',
    // Flight Operations
    'flight operations', 'pre-flight checks', 'inspection duration',
    'walk-around inspection', 'checklists', 'in-flight protocols',
    'cabin safety briefings', 'emergency exits', 'turbulence protocol',
    'post-flight procedures', 'report submission', 'post-flight inspection',
    // Emergency Response
    'emergency response', 'emergency planning', 'drills and simulations',
    'emergency readiness', 'response review meetings', 'response strategies',
    // Safety Training
    'safety training', 'safety education', 'initial training program',
    'recurrent training', 'specialized workshops', 'safety knowledge',
    'emergency procedures', 'role-specific safety training',
    // Safety Reporting
    'safety reporting', 'safety analysis', 'report review frequency',
    'data analysis sessions', 'safety data', 'predictive analysis',
    // Occupational Health and Safety
    'occupational health', 'workplace assessments', 'health check-ups',
    'working environment', 'corrective actions', 'employee health',
    // Environmental and Security
    'environmental compliance', 'environmental impact', 'sustainability',
    'security protocol drills', 'security threats', 'security preparedness',
    // Review and Improvement
    'policy updates', 'stakeholder feedback', 'safety improvements',
    'continuous improvement', 'safety enhancement'
  ];
  
  return safetyKeywords.some(keyword => lowerText.includes(keyword));
}

/**
 * Sends an email notification using fetch API (no additional libraries)
 * Uses a webhook or email service API endpoint
 */
export async function sendSafetyAlertEmail(
  username: string,
  questionText: string
): Promise<void> {
  const recipientEmail = 'jashlodhavia15@gmail.com';
  const subject = 'Safety Alert Triggered';
  const body = `username = ${username}\n\nText = ${questionText}`;
  
  try {
    // Option 1: Use a webhook service (Zapier, Make.com, etc.)
    // Set EMAIL_WEBHOOK_URL in your environment variables
    const webhookUrl = process.env.EMAIL_WEBHOOK_URL;
    
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: recipientEmail,
          subject: subject,
          text: body,
        }),
      });
      return;
    }
    
    // Option 2: Use Resend API (free tier available at resend.com)
    // Set RESEND_API_KEY in your environment variables
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: 'Onboardly <onboarding@resend.dev>', // Update with your verified domain
          to: recipientEmail,
          subject: subject,
          text: body,
        }),
      });
      return;
    }
    
    // Option 3: Use SendGrid API (free tier available)
    // Set SENDGRID_API_KEY in your environment variables
    const sendGridApiKey = process.env.SENDGRID_API_KEY;
    if (sendGridApiKey) {
      await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sendGridApiKey}`,
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: recipientEmail }],
          }],
          from: { email: 'safety-alert@onboardly.ai' }, // Update with your verified email
          subject: subject,
          content: [{
            type: 'text/plain',
            value: body,
          }],
        }),
      });
      return;
    }
    
    // Fallback: Log the email (for development/testing)
    console.log('Safety Alert Email (not sent - configure EMAIL_WEBHOOK_URL, RESEND_API_KEY, or SENDGRID_API_KEY):', {
      to: recipientEmail,
      subject: subject,
      body: body,
    });
    
  } catch (error) {
    console.error('Failed to send safety alert email:', error);
    // Don't throw - we don't want to break the chat flow if email fails
  }
}

