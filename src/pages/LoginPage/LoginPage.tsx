import { Button, Form, Grid, Input, theme, Typography } from "antd";

import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api/authApi.ts";
import { IAuthResponse } from "../../types/authTypes.ts";
import { tokenService } from "../../services/tokenService.ts";
import { useStateContext } from "../../contexts";
import { AxiosError } from "axios";
import { customNotification } from "../../utils/customNotification.ts";
// import { regExpValidator } from "../../utils/regExpValidator.ts";
import { useNavigate } from "react-router-dom";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title } = Typography;

export const LoginPage = () => {
  const { token } = useToken();
  const screens = useBreakpoint();

  const { dispatch } = useStateContext();

  const navigate = useNavigate();

  const { mutate: onLogin, isPending: isLoading } = useMutation({
    mutationKey: ["signIn"],
    mutationFn: authApi.signInUser,
    onSuccess: (data: IAuthResponse) => {
      tokenService.updateLocalTokenData(data.access, "access");
      tokenService.updateLocalTokenData(data.refresh, "refresh");
      dispatch({ type: "SET_AUTH_STATUS", payload: true });
      navigate("/calendar");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      if (error.response && error?.response.status === 401)
        customNotification({
          type: "error",
          message: error?.response?.data.message ?? "Ошибка сервера",
        });
    },
  });

  const styles = {
    container: {
      margin: "0 auto",
      padding: screens.md
        ? `${token.paddingXL}px`
        : `${token.sizeXXL}px ${token.padding}px`,
      width: "380px",
    },
    footer: {
      marginTop: token.marginLG,
      textAlign: "center",
      width: "100%",
    },
    forgotPassword: {
      float: "right",
    },
    header: {
      marginBottom: token.marginSM,
    },
    section: {
      alignItems: "center",
      backgroundColor: token.colorBgContainer,
      display: "flex",
      height: screens.sm ? "100vh" : "auto",
      padding: screens.md ? `${token.sizeXXL}px 0px` : "0px",
    },
    text: {
      color: token.colorTextSecondary,
    },
    title: {
      fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
    },
  };

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="0.464294" width="24" height="24" rx="4.8" fill="#1890FF" />
            <path
              d="M14.8643 3.6001H20.8643V9.6001H14.8643V3.6001Z"
              fill="white"
            />
            <path
              d="M10.0643 9.6001H14.8643V14.4001H10.0643V9.6001Z"
              fill="white"
            />
            <path
              d="M4.06427 13.2001H11.2643V20.4001H4.06427V13.2001Z"
              fill="white"
            />
          </svg>

          <Title style={styles.title}>Страница авторизации</Title>
          <Text style={styles.text}>Введите свои учетные данные</Text>
        </div>
        <Form
          name="normal_login"
          initialValues={{
            remember: true,
          }}
          onFinish={onLogin}
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Обязательное поле!",
              },
              //   {
              //     message: "Введите валидный адрес электронной почты!",
              //     pattern: regExpValidator.emailRule,
              //   },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Обязательное поле!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: "0px" }}>
            <Button
              block
              type="primary"
              htmlType="submit"
              disabled={isLoading}
              size={"large"}
            >
              Войти
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};
