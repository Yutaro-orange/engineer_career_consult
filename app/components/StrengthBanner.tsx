import { determineStrengthLanguage } from "@/app/application/use-cases/skillsUseCases";

// export function StrengthBanner(){
//     const strengthLanguage = determineStrengthLanguage(languages);
//     if(strengthLanguage == null){
//         return null;
//     } else { 
//         return(
//         <Banner>あなたの最大の強みは{determineStrengthLanguage}です</Banner>
//         );
//     }

// }

export function StrengthBanner({ strengthLanguage }: { strengthLanguage: string | null }) {
  if (!strengthLanguage) return null;
  return <div className="strengthBanner">あなたの最大の強みは{strengthLanguage}です</div>;
}