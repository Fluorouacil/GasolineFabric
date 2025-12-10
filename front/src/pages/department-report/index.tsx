import { reportConfigs } from '../../core/resources';
import { ReportListTemplate } from '../../core/templates/ReportListTemplate';

const config = reportConfigs['departments-report'];

export const DepartmentReportList = () => {
  return <ReportListTemplate config={config} />;
};