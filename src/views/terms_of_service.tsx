import React from 'react';

interface GeneratedTermsOfServiceViewProps {
  isContainer?: boolean;
}

export default function GeneratedTermsOfServiceView({ isContainer = false }: GeneratedTermsOfServiceViewProps){
  return (
      <div className="rtext-content" dangerouslySetInnerHTML={{__html: "Sitepaige is not a licensed attorney and cannot write legal terms and conditions. Put your terms and conditions here." }} />
  );
}