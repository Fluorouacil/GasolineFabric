import { reportConfigs } from '../../core/resources';
import { ReportListTemplate } from '../../core/templates/ReportListTemplate';

const config = reportConfigs['employees-report'];

export const EmployeeReportList = () => {
  return <ReportListTemplate config={config} />;
};