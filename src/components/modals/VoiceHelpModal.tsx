import React, { useState } from 'react';
import { Language } from '../../types';

interface VoiceHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const VoiceHelpModal: React.FC<VoiceHelpModalProps> = ({ isOpen, onClose, lang }) => {
  const [isListening, setIsListening] = useState(true);
  const [spokenText, setSpokenText] = useState(
    lang === 'hi'
      ? 'गेहूं की नई फसल का सरकारी न्यूनतम समर्थन मूल्य (MSP) और आज की मंडी दर क्या है?'
      : 'What is the current MSP and today’s mandi price for Sharbati Wheat?'
  );
  const [audioReply, setAudioReply] = useState<string | null>(
    lang === 'hi'
      ? 'नमस्ते रमेश जी! शरबती गेहूं का सरकारी एमएसपी ₹2,275 प्रति क्विंटल है, जबकि फार्मडायरेक्ट पर वर्तमान में खरीददार ₹2,850 प्रति क्विंटल की सीधी बोली लगा रहे हैं। आप ₹575 का सीधा अतिरिक्त लाभ प्राप्त कर सकते हैं।'
      : 'Greetings Ramesh ji! The statutory MSP for Sharbati Wheat is ₹2,275 per quintal, while direct millers on FarmDirect are currently bidding ₹2,850 per quintal. You save the 0% middleman commission.'
  );
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen) return null;

  const handleSpeakSample = (question: string, reply: string) => {
    setIsListening(false);
    setSpokenText(question);
    setAudioReply(reply);
    setIsPlayingAudio(true);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 4500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-black/10 relative flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/5 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#3a692f]/15 flex items-center justify-center text-[#3a692f]">
              <span className="material-symbols-outlined text-[24px]">mic</span>
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1c1c18]">
                {lang === 'hi' ? 'किसान वाणी सहायक (Voice Help)' : 'Kisan Audio Assistant'}
              </h3>
              <p className="text-[11px] text-[#73787b]">
                {lang === 'hi' ? 'भारतीय भाषाओं में त्वरित बोलकर सहायता' : 'Speech-enabled agricultural assistance'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#73787b] hover:text-[#1c1c18] rounded-lg"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Listening Animation / Visualizer */}
        <div className="bg-[#fcf9f3] p-5 rounded-xl flex flex-col items-center justify-center text-center gap-3 border border-black/5">
          <div className="flex items-center justify-center gap-1.5 h-12">
            {[14, 28, 45, 60, 35, 18, 50, 65, 30, 15].map((h, i) => (
              <div
                key={i}
                className="w-1.5 bg-[#3a692f] rounded-full transition-all duration-300"
                style={{
                  height: `${isListening || isPlayingAudio ? h : 10}px`,
                  opacity: isListening || isPlayingAudio ? 1 : 0.4,
                  animation:
                    isListening || isPlayingAudio
                      ? `pulse 1s infinite alternate ${i * 0.1}s`
                      : 'none',
                }}
              />
            ))}
          </div>

          <p className="text-xs font-semibold text-[#3a692f] flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#3a692f] animate-ping" />
            {isListening
              ? lang === 'hi'
                ? 'सुन रहा हूँ... बोलिए (Listening...)'
                : 'Listening to your voice prompt...'
              : isPlayingAudio
              ? lang === 'hi'
                ? 'आवाज़ में जवाब दिया जा रहा है (Speaking)...'
                : 'Playing audio response...'
              : lang === 'hi'
              ? 'तैयार (Ready)'
              : 'Ready'}
          </p>

          <div className="w-full bg-white p-3 rounded-lg border border-black/5 text-left text-xs">
            <span className="text-[10px] text-[#73787b] uppercase tracking-wider font-semibold block mb-1">
              {lang === 'hi' ? 'आपका सवाल (Transcript):' : 'Spoken Query:'}
            </span>
            <p className="text-[#1c1c18] italic font-medium">"{spokenText}"</p>
          </div>
        </div>

        {/* Response Box */}
        {audioReply && (
          <div className="bg-[#b8eea5]/25 p-3.5 rounded-xl border border-[#3a692f]/20 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs text-[#3e6e33] font-bold">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
                {lang === 'hi' ? 'फार्मडायरेक्ट डिजिटल परामर्श' : 'FarmDirect Audio Guidance'}
              </span>
              <button
                onClick={() => {
                  setIsPlayingAudio(true);
                  setTimeout(() => setIsPlayingAudio(false), 4000);
                }}
                className="hover:underline flex items-center gap-1 text-[11px]"
              >
                <span className="material-symbols-outlined text-[14px]">volume_up</span>
                {lang === 'hi' ? 'पुनः सुनें' : 'Play Again'}
              </button>
            </div>
            <p className="text-xs text-[#1c1c18] leading-relaxed">{audioReply}</p>
          </div>
        )}

        {/* Suggested Quick Audio Queries */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] text-[#73787b] font-medium">
            {lang === 'hi' ? 'सामान्य किसान प्रश्न:' : 'Common Farmer Questions:'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() =>
                handleSpeakSample(
                  lang === 'hi'
                    ? 'मेरी गेहूं की 20 क्विंटल फसल के लिए गेट पास कैसे बनेगा?'
                    : 'How do I generate an instant gate pass for my 20 quintal wheat?',
                  lang === 'hi'
                    ? 'गेट पास बनाने के लिए आप डैशबोर्ड में "Print Gate Pass" पर क्लिक करें। आपका डिजिटल क्यूआर कोड तुरंत तैयार हो जाएगा।'
                    : 'To create a gate pass, simply click "Print Gate Pass" on your lot card. A QR verified mandate will be generated instantly.'
                )
              }
              className="text-left p-2 rounded-lg bg-[#f1ede7] hover:bg-[#ebe8e2] text-[#1c1c18] transition-colors"
            >
              🌾 {lang === 'hi' ? 'गेट पास कैसे बनाएं?' : 'How to get gate pass?'}
            </button>
            <button
              onClick={() =>
                handleSpeakSample(
                  lang === 'hi'
                    ? 'एस्क्रो खाते से बैंक में पैसा कब जमा होगा?'
                    : 'When does the escrow funds credit to my bank account?',
                  lang === 'hi'
                    ? 'तौल कांटे पर वजन व नमी की जांच होते ही T+1 कार्यदिवस में PFMS द्वारा पैसा आपके जन धन खाते में सुरक्षित रूप से जमा कर दिया जाता है।'
                    : 'Immediately upon weighbridge clearance, funds are credited via PFMS within T+1 working days directly into your Jan Dhan bank account.'
                )
              }
              className="text-left p-2 rounded-lg bg-[#f1ede7] hover:bg-[#ebe8e2] text-[#1c1c18] transition-colors"
            >
              💰 {lang === 'hi' ? 'पैसा बैंक में कब आएगा?' : 'When is escrow released?'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end gap-2 border-t border-black/5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#3a692f] text-white text-xs font-semibold hover:bg-[#1d4d15] transition-colors"
          >
            {lang === 'hi' ? 'सम्पन्न (Done)' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
