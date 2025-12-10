import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Spin, Alert } from 'antd';
import { 
  ToolOutlined, 
  DollarOutlined, 
  WarningOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const API_URL = 'http://localhost:8080';

interface VerificationStats {
  overdue_count: number;
  due_this_month: number;
  due_next_month: number;
  verified_count: number;
}

interface DepartmentSummary {
  department_id: string;
  department_name: string;
  equipment_count: number;
  total_value: number;
  residual_value: number;
}

interface TypeSummary {
  type_id: string;
  type_name: string;
  equipment_count: number;
  total_value: number;
}

interface SummaryData {
  total_count: number;
  total_value: number;
  total_residual_value: number;
  by_status: Record<string, number>;
  by_department: DepartmentSummary[];
  by_type: TypeSummary[];
  verification_stats: VerificationStats;
}

export const EquipmentSummaryReport: React.FC = () => {
  const [report, setReport] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching from:', `${API_URL}/reports/equipment/summary`);
        
        const response = await fetch(`${API_URL}/reports/equipment/summary`);
        console.log('Response status:', response.status);
        
        const json = await response.json();
        console.log('JSON:', json);
        
        setReport(json.data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(String(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  }

  if (error) {
    return <Alert type="error" message="Ошибка загрузки" description={error} />;
  }

  if (!report) {
    return <Alert type="warning" message="Нет данных" />;
  }

  const statusColors: Record<string, string> = {
    'active': 'green',
    'in_use': 'green',
    'in_repair': 'orange',
    'on_verification': 'blue',
    'decommissioned': 'red',
    'in_storage': 'cyan'
  };

  const statusLabels: Record<string, string> = {
    'active': 'Активно',
    'in_use': 'В использовании',
    'in_repair': 'В ремонте',
    'on_verification': 'На поверке',
    'decommissioned': 'Списано',
    'in_storage': 'На складе'
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Сводный отчёт по оборудованию</h1>

      {/* Общая статистика */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Всего оборудования"
              value={report.total_count}
              prefix={<ToolOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Общая стоимость"
              value={report.total_value}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="₽"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Остаточная стоимость"
              value={report.total_residual_value}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              suffix="₽"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Поверок в этом году"
              value={report.verification_stats?.verified_count ?? 0}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Статистика поверок */}
      <Card title="Статистика поверок" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="Просрочено"
              value={report.verification_stats?.overdue_count ?? 0}
              valueStyle={{ color: '#cf1322' }}
              prefix={<WarningOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="В этом месяце"
              value={report.verification_stats?.due_this_month ?? 0}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="В следующем месяце"
              value={report.verification_stats?.due_next_month ?? 0}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Выполнено в этом году"
              value={report.verification_stats?.verified_count ?? 0}
              valueStyle={{ color: '#3f8600' }}
            />
          </Col>
        </Row>
      </Card>

      {/* По статусам */}
      <Card title="По статусам" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          {Object.entries(report.by_status || {}).map(([status, count]) => (
            <Col key={status}>
              <Tag 
                color={statusColors[status] || 'default'} 
                style={{ fontSize: 14, padding: '8px 16px' }}
              >
                {statusLabels[status] || status}: {count}
              </Tag>
            </Col>
          ))}
        </Row>
      </Card>

      <Row gutter={16}>
        {/* По подразделениям */}
        <Col xs={24} lg={12}>
          <Card title="По подразделениям">
            <Table
              dataSource={report.by_department || []}
              rowKey="department_id"
              pagination={false}
              size="small"
              columns={[
                { 
                  title: 'Подразделение', 
                  dataIndex: 'department_name', 
                  key: 'name' 
                },
                { 
                  title: 'Кол-во', 
                  dataIndex: 'equipment_count', 
                  key: 'count',
                  align: 'right' as const
                },
                { 
                  title: 'Стоимость', 
                  dataIndex: 'total_value', 
                  key: 'value',
                  align: 'right' as const,
                  render: (v: number) => `${(v || 0).toLocaleString('ru-RU')} ₽`
                },
                { 
                  title: 'Остаточная', 
                  dataIndex: 'residual_value', 
                  key: 'residual',
                  align: 'right' as const,
                  render: (v: number) => `${(v || 0).toLocaleString('ru-RU')} ₽`
                },
              ]}
            />
          </Card>
        </Col>

        {/* По типам */}
        <Col xs={24} lg={12}>
          <Card title="По типам оборудования">
            <Table
              dataSource={report.by_type || []}
              rowKey="type_id"
              pagination={false}
              size="small"
              columns={[
                { 
                  title: 'Тип', 
                  dataIndex: 'type_name', 
                  key: 'name' 
                },
                { 
                  title: 'Кол-во', 
                  dataIndex: 'equipment_count', 
                  key: 'count',
                  align: 'right' as const
                },
                { 
                  title: 'Стоимость', 
                  dataIndex: 'total_value', 
                  key: 'value',
                  align: 'right' as const,
                  render: (v: number) => `${(v || 0).toLocaleString('ru-RU')} ₽`
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};