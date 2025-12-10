import { reportConfigs } from '../../core/resources';
import { ReportListTemplate } from '../../core/templates/ReportListTemplate';

const config = reportConfigs['verifications-period'];

export const VerificationsPeriodList = () => {
  return <ReportListTemplate config={config} />;
};