import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Descriptions, Tag, Spin, Alert, Drawer } from 'antd';
import { EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { axiosInstance } from '../../api';
import { formatDateTime } from '../../utils/date/getDates';
import { customNotification } from '../../utils/customNotification';
import { VisitUpdateForm } from '../../components/Visits/VisitUpdateForm/VisitUpdateForm';
import { changeFormFieldsData } from '../../utils/changeFormFieldsData';
import { datePickerFormatter, formatDateToString } from '../../utils/date/getDates';
import { FormInitialFieldsParamsType } from '../../types/common';
import { IVisit, IVisitCreate } from '../../types/visits';
import styles from './styles.module.scss';

const initialValues: FormInitialFieldsParamsType[] = [
  { name: "date", value: "" },
  { name: "is_child", value: false },
  { name: "note", value: "" },
  { name: "paid", value: false },
  { name: "approved_by_clinic", value: false },
  { name: "status_id", value: null },
];

export const VisitDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formInitialFields, setFormInitialFields] = useState<FormInitialFieldsParamsType[]>(initialValues);

  const { data: visit, isLoading, error } = useQuery({
    queryKey: ['visitDetail', id],
    queryFn: () =>
        axiosInstance
            .get<IVisit>(`employee_endpoints/visits/${id}/`)
            .then(response => response.data),
    enabled: !!id,
  });

  const { mutate: onUpdate, isPending: isUpdateLoading } = useMutation({
    mutationKey: ['updateVisit'],
    mutationFn: ({ id, ...body }: IVisitCreate) => {
      return axiosInstance.patch(`employee_endpoints/visits/${id}/`, body);
    },
    onSuccess: () => {
      customNotification({
        type: 'success',
        message: 'Запись успешно изменена!',
      });
      queryClient.invalidateQueries({ queryKey: ['visitDetail', id] });
      setEditModalOpen(false);
    },
  });

  const handleEdit = () => {
    if (visit) {
      setFormInitialFields(
          changeFormFieldsData<object>(initialValues, {
            ...visit,
            date: datePickerFormatter(visit.date ?? ''),
            status_id: visit.visit_status?.id,
            paid: visit.is_paid,
          })
      );
      setEditModalOpen(true);
    }
  };

  const handleSubmitEdit = (formData: IVisitCreate) => {
    const payload = {
      ...formData,
      date: formatDateToString(formData?.date?.$d ?? null) ?? '',
      id: visit?.id,
      // Добавляем обязательные поля для IVisitCreate
      doctor_id: visit?.doctor_profile?.id || null,
      doctor_procedure_id: visit?.doctor_procedure?.id || null,
      visit_time_id: visit?.visit_time_slot?.id || null,
      clinic_branch_id: visit?.clinic?.id || null,
      patient_id: visit?.patient?.id || null,
      approved: visit?.approved_by_admin || false,
    };
    onUpdate(payload);
  };

  const handleCloseEdit = () => {
    setEditModalOpen(false);
    setFormInitialFields(initialValues);
  };

  if (isLoading) {
    return (
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
    );
  }

  if (error || !visit) {
    return (
        <div className={styles.error}>
          <Alert
              message="Ошибка"
              description="Не удалось загрузить информацию о записи"
              type="error"
              showIcon
          />
          <Button
              type="primary"
              onClick={() => navigate('/visits')}
              style={{ marginTop: 16 }}
          >
            Вернуться к списку записей
          </Button>
        </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'завершено':
        return 'green';
      case 'в обработке':
        return 'blue';
      case 'отменено':
        return 'red';
      case 'подтверждено':
        return 'cyan';
      default:
        return 'default';
    }
  };

  return (
      <>
        <div className={styles.container}>
          <div className={styles.header}>
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/visits')}
                type="text"
            >
              Назад к записям
            </Button>
            <h1>Детали записи #{visit.id}</h1>
            <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleEdit}
            >
              Редактировать
            </Button>
          </div>

          <div className={styles.content}>
            <Card title="Информация о записи" className={styles.card}>
              <Descriptions column={2} bordered>
                <Descriptions.Item label="ID записи">
                  {visit.id}
                </Descriptions.Item>

                <Descriptions.Item label="Статус">
                  <Tag color={getStatusColor(visit.visit_status.title)}>
                    {visit.visit_status.title}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Дата и время">
                  {formatDateTime({
                    inputDate: visit.date,
                    inputTime: visit.visit_time_slot.start_time,
                  })}
                  {' - '}
                  {visit.visit_time_slot.end_time}
                </Descriptions.Item>

                <Descriptions.Item label="Клиника">
                  <div>
                    <div><strong>{visit?.clinic?.title}</strong></div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {visit?.clinic?.address}, {visit?.clinic?.city}
                    </div>
                  </div>
                </Descriptions.Item>

                <Descriptions.Item label="Врач">
                  {visit.doctor_profile?.full_name || 'Не указан'}
                </Descriptions.Item>

                <Descriptions.Item label="Процедура">
                  {visit.doctor_procedure?.medical_procedure?.title || 'Не указана'}
                </Descriptions.Item>

                <Descriptions.Item label="Стоимость">
                  {visit?.doctor_procedure_price?.final_price
                      ? `${visit?.doctor_procedure_price?.final_price} тенге`
                      : 'Не указана'
                  }
                </Descriptions.Item>

                <Descriptions.Item label="Заметка">
                  {visit.note || 'Нет заметок'}
                </Descriptions.Item>

                <Descriptions.Item label="Детская запись">
                  <Tag color={visit.is_child ? 'green' : 'default'}>
                    {visit.is_child ? 'Да' : 'Нет'}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Оплачено">
                  <Tag color={visit.is_paid ? 'green' : 'orange'}>
                    {visit.is_paid ? 'Да' : 'Нет'}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Подтверждено клиникой">
                  <Tag color={visit.approved_by_clinic ? 'green' : 'orange'}>
                    {visit.approved_by_clinic ? 'Да' : 'Нет'}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Подтверждено администратором">
                  <Tag color={visit?.approved_by_admin ? 'green' : 'orange'}>
                    {visit?.approved_by_admin ? 'Да' : 'Нет'}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="Информация о пациенте" className={styles.card}>
              <Descriptions column={2} bordered>
                <Descriptions.Item label="ФИО">
                  {visit.patient.full_name}
                </Descriptions.Item>

                <Descriptions.Item label="Телефон">
                  {visit.patient.phone_number}
                </Descriptions.Item>

                <Descriptions.Item label="Дата рождения">
                  {visit.patient.birth_date
                      ? new Date(visit.patient.birth_date).toLocaleDateString('ru-RU')
                      : 'Не указана'
                  }
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="Системная информация" className={styles.card}>
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Дата создания">
                  {formatDateTime({ isoDateTime: visit.created_at })}
                </Descriptions.Item>

                <Descriptions.Item label="Дата обновления">
                  {formatDateTime({ isoDateTime: visit.updated_at })}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>
        </div>

        <Drawer
            title="Редактирование записи"
            onClose={handleCloseEdit}
            open={editModalOpen}
            width="500px"
        >
          <VisitUpdateForm
              formType="update"
              initialFields={formInitialFields}
              onSubmit={handleSubmitEdit}
              onClose={handleCloseEdit}
              isLoading={isUpdateLoading}
          />
        </Drawer>
      </>
  );
};
