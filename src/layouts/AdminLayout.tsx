import React, { useMemo, useState } from "react";
import {
  Layout,
  Menu,
  Breadcrumb,
  Typography,
  Space,
  Button,
  Dropdown,
  Switch,
  theme,
} from "antd";
import type { MenuProps } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  GlobalOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BulbOutlined,
  BulbFilled,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { useAppStore } from "@/stores/app";
import { useAuthStore } from "@/stores/auth";

const { Header, Sider, Content } = Layout;

type NavItem = {
  key: string;
  labelKey: string;
  icon?: React.ReactNode;
  path: string;
};

const navItems: NavItem[] = [
  {
    key: "dashboard",
    labelKey: "route.dashboard",
    icon: <DashboardOutlined />,
    path: "/dashboard",
  },
];

function getSelectedKey(pathname: string) {
  const hit = navItems.find(
    (x) => pathname === x.path || pathname.startsWith(`${x.path}/`)
  );
  return hit?.key ? [hit.key] : [];
}

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { token } = theme.useToken();

  const [collapsed, setCollapsed] = useState(false);
  const locale = useAppStore((s) => s.locale);
  const setLocale = useAppStore((s) => s.setLocale);
  const themeMode = useAppStore((s) => s.themeMode);
  const setThemeMode = useAppStore((s) => s.setThemeMode);
  const logout = useAuthStore((s) => s.logout);

  const selectedKeys = useMemo(
    () => getSelectedKey(location.pathname),
    [location.pathname]
  );

  const menuItems: MenuProps["items"] = useMemo(
    () =>
      navItems.map((x) => ({
        key: x.key,
        icon: x.icon,
        label: t(x.labelKey),
        onClick: () => navigate(x.path),
      })),
    [navigate, t]
  );

  const breadcrumbs = useMemo(() => {
    const hit = navItems.find(
      (x) =>
        location.pathname === x.path ||
        location.pathname.startsWith(`${x.path}/`)
    );
    return hit ? [t(hit.labelKey)] : [];
  }, [location.pathname, t]);

  const langMenuItems: MenuProps["items"] = [
    {
      key: "zh-CN",
      label: "中文",
      onClick: () => {
        localStorage.setItem("yyz_admin_locale", "zh-CN");
        setLocale("zh-CN");
        i18n.changeLanguage("zh-CN");
      },
    },
    {
      key: "en-US",
      label: "English",
      onClick: () => {
        localStorage.setItem("yyz_admin_locale", "en-US");
        setLocale("en-US");
        i18n.changeLanguage("en-US");
      },
    },
  ];

  const isDark = themeMode === "dark";

  // 顶部菜单（通栏）
  const topMenuItems: MenuProps["items"] = useMemo(
    () => [
      {
        key: "dashboard",
        label: t("route.dashboard"),
        onClick: () => navigate("/dashboard"),
      },
    ],
    [navigate, t]
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* 顶部 - 侧边布局 - 通栏（参考 antd Layout 文档示例） */}
      <Header
        style={{
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Space size={12} align="center">
          <div style={{ width: 160, display: "flex", alignItems: "center" }}>
            <Typography.Title
              level={5}
              style={{ margin: 0, whiteSpace: "nowrap", color: "#fff" }}
            >
              YYZ Admin
            </Typography.Title>
          </div>

          <Menu
            mode="horizontal"
            theme="dark"
            selectedKeys={selectedKeys}
            items={topMenuItems}
            style={{
              borderBottom: 0,
              minWidth: 320,
              background: "transparent",
            }}
          />
        </Space>

        <Space>
          <Switch
            checked={isDark}
            checkedChildren={<BulbFilled />}
            unCheckedChildren={<BulbOutlined />}
            onChange={(checked) => setThemeMode(checked ? "dark" : "light")}
          />
          <Dropdown
            menu={{
              items: langMenuItems,
              selectable: true,
              selectedKeys: [locale],
            }}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<GlobalOutlined />}
              style={{ color: "#fff" }}
            >
              {t("common.language")}
            </Button>
          </Dropdown>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            style={{ color: "#fff" }}
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
          >
            {t("common.logout")}
          </Button>
        </Space>
      </Header>

      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          trigger={null}
          theme={isDark ? "dark" : "light"}
          width={220}
          style={{ borderRight: `1px solid ${token.colorBorderSecondary}` }}
        >
          <div
            style={{
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 12px",
            }}
          >
            <Typography.Text style={{ opacity: 0.85 }}>
              {collapsed ? "" : t("route.dashboard")}
            </Typography.Text>
            <Button
              type="text"
              aria-label="toggle-sider"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed((v) => !v)}
            />
          </div>
          <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            items={menuItems}
            theme={isDark ? "dark" : "light"}
          />
        </Sider>

        <Layout style={{ background: token.colorBgLayout }}>
          <Content style={{ padding: 16 }}>
            <Breadcrumb
              items={breadcrumbs.map((x) => ({ title: x }))}
              style={{ marginBottom: 12 }}
            />
            <div
              style={{
                background: token.colorBgContainer,
                borderRadius: 8,
                padding: 16,
                minHeight: 360,
              }}
            >
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
