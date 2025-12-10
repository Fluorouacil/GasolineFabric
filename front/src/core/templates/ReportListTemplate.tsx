// src/core/templates/ReportListTemplate.tsx
import { Table, Card, Statistic, Row, Col } from 'antd';
import { DateField, List, useTable } from '@refinedev/antd';
import { ReportConfig } from '../types';

interface ReportListTemplateProps<T> {
  config: ReportConfig<T>;
}

export const ReportListTemplate = <T extends { [key: string]: any }>({ config }: ReportListTemplateProps<T>) => {
  const { tableProps, tableQueryResult } = useTable<T>({
    syncWithLocation: true,
    resource: config.apiResource ? `reports/${config.apiResource}`: config.name,
  });

  let dataSource: T[] = [];
  let totals: any = null;

  const rawData = tableProps.dataSource as any;

  if (Array.isArray(rawData)) {
    dataSource = rawData;
    totals = (tableQueryResult?.data as any)?.totals;
  } else if (rawData && typeof rawData === 'object') {
    dataSource = rawData.data || [];
    totals = rawData.totals;
  }

  const renderValue = (field: any, value: any, record: T) => {
    if (value === undefined || value === null) return '—';
    if (field.type === 'date') return <DateField value={value} format="DD.MM.YYYY" />;
    if (field.type === 'money') {
      return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(value);
    }
    if (field.type === 'percent') return `${value}%`;
    return value;
  };

  const columns = config.listColumns
    ? config.listColumns.map((key) => {
        const field = config.fields.find((f) => f.name === key);
        return {
          dataIndex: key,
          title: field?.label || String(key),
          render: (value: any, record: T) => (field ? renderValue(field, value, record) : value),
        };
      })
    : config.fields.map((field) => ({
        dataIndex: field.name,
        title: field.label,
        render: (value: any, record: T) => renderValue(field, value, record),
      }));

  return (
    <List>
      <Table
        {...tableProps}
        dataSource={dataSource}
        rowKey={(record: any) => record.id || record.equipment_id || Math.random()}
        columns={columns}
        scroll={{ x: 'max-content' }}
      />

      {totals && config.totalsConfig && config.totalsConfig.length > 0 && (
        <Card style={{ marginTop: 20, background: '#fafafa' }} title="Итоговая статистика">
          <Row gutter={[16, 16]}>
            {config.totalsConfig.map((item) => {
              const value = totals[item.key];
              
              return (
                <Col span={item.span || 6} key={item.key} xs={24} sm={12} md={6}>
                  <Statistic
                    title={item.label}
                    value={value}
                    precision={2}
                    valueStyle={item.color ? { color: item.color } : undefined}
                    suffix={item.type === 'money' ? '₽' : undefined}
                    formatter={item.type === 'money' ? undefined : (val) => val} 
                  />
                </Col>
              );
            })}
          </Row>
        </Card>
      )}
    </List>
  );
};