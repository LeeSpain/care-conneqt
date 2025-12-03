import { Badge } from "@/components/ui/badge";
import { Building2, Users, Briefcase, Shield, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { CustomerType } from "@/hooks/useFinance";

interface CustomerTypeBadgeProps {
  customerType?: CustomerType | string | null;
  showLabel?: boolean;
}

export function CustomerTypeBadge({ customerType, showLabel = true }: CustomerTypeBadgeProps) {
  const { t } = useTranslation('dashboard-admin');
  
  const type = customerType || 'member';
  
  const config: Record<string, { icon: React.ReactNode; class: string; label: string }> = {
    member: {
      icon: <User className="h-3 w-3" />,
      class: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      label: t('finance.customerTypes.member')
    },
    facility: {
      icon: <Building2 className="h-3 w-3" />,
      class: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      label: t('finance.customerTypes.facility')
    },
    care_company: {
      icon: <Briefcase className="h-3 w-3" />,
      class: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      label: t('finance.customerTypes.careCompany')
    },
    insurance_company: {
      icon: <Shield className="h-3 w-3" />,
      class: 'bg-teal-500/10 text-teal-500 border-teal-500/20',
      label: t('finance.customerTypes.insurance')
    }
  };
  
  const { icon, class: className, label } = config[type] || config.member;
  
  return (
    <Badge variant="outline" className={`${className} flex items-center gap-1`}>
      {icon}
      {showLabel && <span>{label}</span>}
    </Badge>
  );
}
