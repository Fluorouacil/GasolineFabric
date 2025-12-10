import { reportConfigs } from '../../core/resources';
import { ReportListTemplate } from '../../core/templates/ReportListTemplate';

const config = reportConfigs['verifications-due'];

export const VerificationsDueList = () => {
  return <ReportListTemplate config={config} />;
};