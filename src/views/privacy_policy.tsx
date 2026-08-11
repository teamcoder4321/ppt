import React from 'react';

interface GeneratedPrivacyPolicyViewProps {
  isContainer?: boolean;
}

export default function GeneratedPrivacyPolicyView({ isContainer = false }: GeneratedPrivacyPolicyViewProps){
  return (
      <div className="rtext-content" dangerouslySetInnerHTML={{__html: "Sitepaige is not a licensed attorney and cannot write privacy policies. Put your privacy policy here." }} />
  );
}