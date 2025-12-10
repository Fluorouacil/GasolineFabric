
import { reportConfigs } from '../../core/resources';
import { ReportListTemplate } from '../../core/templates/ReportListTemplate';

const config = reportConfigs['depreciation'];

export const DepreciationReportList = () => {
  return <ReportListTemplate config={config} />;
};
