import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import type { CustomerType } from "@/hooks/useFinance";

interface CustomerTypeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function CustomerTypeFilter({ value, onChange }: CustomerTypeFilterProps) {
  const { t } = useTranslation('dashboard-admin');
  
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full md:w-[180px]">
        <SelectValue placeholder={t('finance.filterByCustomerType')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t('common:status.all')}</SelectItem>
        <SelectItem value="member">{t('finance.customerTypes.member')}</SelectItem>
        <SelectItem value="facility">{t('finance.customerTypes.facility')}</SelectItem>
        <SelectItem value="care_company">{t('finance.customerTypes.careCompany')}</SelectItem>
        <SelectItem value="insurance_company">{t('finance.customerTypes.insurance')}</SelectItem>
      </SelectContent>
    </Select>
  );
}
