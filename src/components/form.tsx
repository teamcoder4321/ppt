'use client';

import React, { useState } from 'react';
import { Design } from '../store/blueprint';

interface RFormProps {
  name: string;
  custom_view_description: string;
  design: Design;
}

// Translation function for form submit text
const getFormTranslation = (key: string, websiteLanguage: string) => {
  const translations: Record<string, Record<string, string>> = {
    'Submit': {
      'English': 'Submit',
      'Spanish': 'Enviar',
      'French': 'Soumettre',
      'German': 'Absenden',
      'Portuguese': 'Enviar',
      'Italian': 'Invia',
      'Dutch': 'Versturen',
      'Chinese': '提交',
      'Japanese': '送信',
      'Korean': '제출',
      'Russian': 'Отправить',
      'Arabic': 'إرسال',
      'Hindi': 'सबमिट करें'
    },
    'Submitting...': {
      'English': 'Submitting...',
      'Spanish': 'Enviando...',
      'French': 'Envoi en cours...',
      'German': 'Wird gesendet...',
      'Portuguese': 'Enviando...',
      'Italian': 'Invio in corso...',
      'Dutch': 'Bezig met versturen...',
      'Chinese': '提交中...',
      'Japanese': '送信中...',
      'Korean': '제출 중...',
      'Russian': 'Отправка...',
      'Arabic': 'جاري الإرسال...',
      'Hindi': 'सबमिट हो रहा है...'
    },
    'Submit Another Response': {
      'English': 'Submit Another Response',
      'Spanish': 'Enviar otra respuesta',
      'French': 'Soumettre une autre réponse',
      'German': 'Weitere Antwort senden',
      'Portuguese': 'Enviar outra resposta',
      'Italian': 'Invia un\'altra risposta',
      'Dutch': 'Nog een reactie versturen',
      'Chinese': '提交另一个回复',
      'Japanese': '別の回答を送信',
      'Korean': '다른 응답 제출',
      'Russian': 'Отправить еще один ответ',
      'Arabic': 'إرسال رد آخر',
      'Hindi': 'एक और प्रतिक्रिया सबमिट करें'
    },
    'Thank You!': {
      'English': 'Thank You!',
      'Spanish': '¡Gracias!',
      'French': 'Merci!',
      'German': 'Vielen Dank!',
      'Portuguese': 'Obrigado!',
      'Italian': 'Grazie!',
      'Dutch': 'Bedankt!',
      'Chinese': '谢谢！',
      'Japanese': 'ありがとうございます！',
      'Korean': '감사합니다!',
      'Russian': 'Спасибо!',
      'Arabic': 'شكراً لك!',
      'Hindi': 'धन्यवाद!'
    },
    'Your form has been submitted successfully. We\'ll get back to you soon.': {
      'English': 'Your form has been submitted successfully. We\'ll get back to you soon.',
      'Spanish': 'Tu formulario ha sido enviado exitosamente. Nos pondremos en contacto contigo pronto.',
      'French': 'Votre formulaire a été soumis avec succès. Nous vous contacterons bientôt.',
      'German': 'Ihr Formular wurde erfolgreich gesendet. Wir werden uns bald bei Ihnen melden.',
      'Portuguese': 'Seu formulário foi enviado com sucesso. Entraremos em contato em breve.',
      'Italian': 'Il tuo modulo è stato inviato con successo. Ti contatteremo presto.',
      'Dutch': 'Uw formulier is succesvol verzonden. We nemen binnenkort contact met u op.',
      'Chinese': '您的表单已成功提交。我们会尽快与您联系。',
      'Japanese': 'フォームが正常に送信されました。近日中にご連絡いたします。',
      'Korean': '양식이 성공적으로 제출되었습니다. 곧 연락드리겠습니다.',
      'Russian': 'Ваша форма успешно отправлена. Мы свяжемся с вами в ближайшее время.',
      'Arabic': 'تم إرسال النموذج بنجاح. سنتواصل معك قريباً.',
      'Hindi': 'आपका फॉर्म सफलतापूर्वक सबमिट किया गया है। हम जल्द ही आपसे संपर्क करेंगे।'
    },
    'Form secured by FormSubmit': {
      'English': 'Form secured by FormSubmit',
      'Spanish': 'Formulario protegido por FormSubmit',
      'French': 'Formulaire sécurisé par FormSubmit',
      'German': 'Formular gesichert durch FormSubmit',
      'Portuguese': 'Formulário protegido por FormSubmit',
      'Italian': 'Modulo protetto da FormSubmit',
      'Dutch': 'Formulier beveiligd door FormSubmit',
      'Chinese': '表单由FormSubmit保护',
      'Japanese': 'FormSubmitによって保護されたフォーム',
      'Korean': 'FormSubmit로 보호된 양식',
      'Russian': 'Форма защищена FormSubmit',
      'Arabic': 'النموذج محمي بواسطة FormSubmit',
      'Hindi': 'फॉर्म FormSubmit द्वारा सुरक्षित'
    }
  };

  // Determine which language to use
  let language = 'English'; // Default
  if (websiteLanguage) {
    // Extract the main language from the input
    const langMap: Record<string, string> = {
      'English': 'English',
      'Spanish': 'Spanish',
      'French': 'French',
      'German': 'German',
      'Portuguese': 'Portuguese',
      'Italian': 'Italian',
      'Dutch': 'Dutch',
      'Chinese': 'Chinese',
      'Japanese': 'Japanese',
      'Korean': 'Korean',
      'Russian': 'Russian',
      'Arabic': 'Arabic',
      'Hindi': 'Hindi'
    };
    
    // Find the matching language
    for (const [langKey, langValue] of Object.entries(langMap)) {
      if (websiteLanguage.includes(langKey)) {
        language = langValue;
        break;
      }
    }
  }

  return translations[key]?.[language] || key;
};

interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'dropdown';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

interface FormData {
  submissionEmail: string;
  useCaptcha: boolean;
  fields: FormField[];
}

export default function RForm({ name, custom_view_description, design }: RFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parse form configuration
  let formData: FormData = {
    submissionEmail: '',
    useCaptcha: true,
    fields: []
  };

  try {
    if (custom_view_description) {
      formData = JSON.parse(custom_view_description);
    }
  } catch (e) {
    console.error('Error parsing form data:', e);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    // Get form data
    const form = e.currentTarget;
    const formDataObj: Record<string, any> = {};
    
    // Collect all form fields
    formData.fields.forEach((field) => {
      const element = form.elements.namedItem(field.name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      if (element) {
        formDataObj[field.name] = element.value;
      }
    });
    
    // Add metadata
    formDataObj._formName = name;
    if (formData.submissionEmail) {
      formDataObj._notificationEmail = formData.submissionEmail;
    }
    
    try {
      // Get CSRF token if available
      const csrfMeta = document.querySelector('meta[name="csrf-token"]');
      const csrfToken = csrfMeta?.getAttribute('content');
      
      const response = await fetch('/api/form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken && { 'X-CSRF-Token': csrfToken })
        },
        body: JSON.stringify({
          formName: name,
          data: formDataObj
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSubmitted(true);
        setIsSubmitting(false);
      } else {
        setError(result.error || 'Failed to submit form. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError('Network error. Please check your connection and try again.');
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h1>{name}</h1>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <svg
            className="w-16 h-16 text-green-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-2xl font-bold text-green-800 mb-2">{getFormTranslation('Thank You!', design.websiteLanguage)}</h3>
          <p className="text-green-700">
            {getFormTranslation('Your form has been submitted successfully. We\'ll get back to you soon.', design.websiteLanguage)}
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setError(null);
            }}
            className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            {getFormTranslation('Submit Another Response', design.websiteLanguage)}
          </button>
        </div>
      </div>
    );
  }

  const inputClassName = `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`;
  const labelClassName = `block text-sm font-medium mb-2`;

  // Apply design colors
  const formStyles = {
    '--input-bg': design.inputBackgroundColor || '#f9fafb',
    '--input-text': design.inputTextColor || '#111827',
    '--input-border': design.accentColor || '#d1d5db',
    '--input-radius': design.inputBorderRadius || '0.5rem',
    '--button-bg': design.accentColor || '#3b82f6',
    '--button-text': design.accentTextColor || '#ffffff',
    '--button-radius': design.buttonRoundedness === 'rounded' ? '0.5rem' : 
                      design.buttonRoundedness === 'pill' ? '9999px' : '0',
    '--text-color': design.textColor || '#374151',
    '--title-color': design.titleColor || '#111827',
  } as React.CSSProperties;

  return (
    <div className="w-full max-w-2xl mx-auto p-6" style={formStyles}>
      <h1>{name}</h1>
      <form 
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Display error message if any */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <p className="font-medium">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}
        
        {/* Render form fields */}
        {formData.fields.map((field, index) => (
          <div key={field.id || index} className="form-field">
            <label 
              htmlFor={field.name}
              className={labelClassName}
              style={{ color: 'var(--text-color)' }}
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {field.type === 'text' && (
              <input
                type="text"
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                required={field.required}
                className={inputClassName}
                style={{
                  backgroundColor: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  borderColor: 'var(--input-border)',
                  borderRadius: 'var(--input-radius)'
                }}
              />
            )}
            
            {field.type === 'textarea' && (
              <textarea
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                required={field.required}
                rows={4}
                className={inputClassName}
                style={{
                  backgroundColor: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  borderColor: 'var(--input-border)',
                  borderRadius: 'var(--input-radius)',
                  resize: 'vertical'
                }}
              />
            )}
            
            {field.type === 'dropdown' && (
              <select
                id={field.name}
                name={field.name}
                required={field.required}
                className={inputClassName}
                style={{
                  backgroundColor: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  borderColor: 'var(--input-border)',
                  borderRadius: 'var(--input-radius)'
                }}
              >
                <option value="">
                  {field.placeholder || 'Select an option...'}
                </option>
                {(field.options || []).map((option, optIndex) => (
                  <option key={optIndex} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
        
        {/* Submit button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-6 py-3 font-medium transition-all duration-200 ${
              isSubmitting 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:opacity-90 hover:shadow-lg'
            }`}
            style={{
              backgroundColor: 'var(--button-bg)',
              color: 'var(--button-text)',
              borderRadius: 'var(--button-radius)'
            }}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg 
                  className="animate-spin -ml-1 mr-3 h-5 w-5" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {getFormTranslation('Submitting...', design.websiteLanguage)}
              </span>
            ) : (
              getFormTranslation('Submit', design.websiteLanguage)
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
