import {
    ActionIcon,
    AppShell,
    Box,
    Burger,
    Button,
    Center,
    Header,
    Container,
    MediaQuery,
    Navbar,
    rem,
    ScrollArea,
    SegmentedControl,
    TextInput,
    Tooltip,
    Text,
    Aside,
    Footer,
    useMantineColorScheme,
    useMantineTheme,
} from "@mantine/core";
import {
    IconBrandGithub,
    IconBrandTwitter,
    IconDatabase,
    IconMessage,
    IconMoonStars,
    IconPlus,
    IconSearch,
    IconSettings,
    IconSunHigh,
    IconLogin,
    IconX,
} from "@tabler/icons-react";

import { Link, Outlet, useNavigate, useRouter } from "@tanstack/react-location";
import { LogoDIcon, LogoLIcon } from "./Logo";
import { useEffect, useState } from "react";
import {LoginModal} from "./Login"
import { Chats } from "./chats";

export default function Layout() {
    const theme = useMantineTheme();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const [tab, setTab] = useState<"Chats" | "Prompts">("Chats");
    const border = `${rem(1)} solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
        }`;
    const [hovered, setHovered] = useState(false);
    const [clicked, setClicked] = useState(false);
    const navigate = useNavigate();

    return (
        <AppShell
            className={`${colorScheme}-theme`}
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            header={
                <Header height={5} p="xs">

                </Header>
            }
            footer={
                <Footer height={5} p="xs">
                </Footer>
            }
            aside={
                <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 20, lg: 45 }}
                    style={{ display: 'flex', alignItems: 'center', marginTop: 0 }}
                >
                    <ActionIcon
                        size="xs"
                        onClick={() => toggleColorScheme()}
                    >
                        {colorScheme === "dark" ? (
                            <IconSunHigh size={20} />
                        ) : (
                            <IconMoonStars size={20} />
                        )}
                    </ActionIcon>
                </Aside>

            }
            navbar={
                <Navbar p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
                    <Navbar.Section className="app-region-drag">
                        <Box
                            style={{
                                height: 50,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderBottom: border,
                            }}
                        >
                            {colorScheme === "dark" ? (
                                <LogoDIcon style={{
                                    height: 20,
                                    display: "block",
                                }}
                                ></LogoDIcon>
                            ) : (
                                <LogoLIcon style={{
                                    height: 20,
                                    display: "block",
                                }}></LogoLIcon>
                            )}

                        </Box>
                    </Navbar.Section>
                    <Navbar.Section
                        sx={(theme) => ({
                            padding: rem(4),
                            background:
                                theme.colorScheme === "dark"
                                    ? theme.colors.dark[8]
                                    : theme.colors.gray[1],
                            borderBottom: border,
                        })}
                    >
                        <SegmentedControl
                            fullWidth
                            value={tab}
                            onChange={(value) => setTab(value as typeof tab)}
                            data={["Chats", "Prompts"]}
                        />
                        <Box sx={{ padding: 4 }}>
                            {tab === "Chats" && (
                                <Button
                                    fullWidth
                                    variant="outline"
                                    styles={{
                                        root: {
                                            borderColor: hovered ? '#6ecde4' : '#8a9da2',
                                            backgroundColor: 'transparent',
                                            color: theme.colorScheme === "dark"
                                                ? theme.colors.gray[0]
                                                : theme.colors.dark[6],
                                        },
                                    }}
                                    onMouseEnter={() => setHovered(true)}
                                    onMouseLeave={() => setHovered(false)}
                                    onClick={() => {
                                        setClicked(!clicked);
                                        navigate({ to: `/chats/ZDZL3iLiuKzb1WQ5Xg4w6` });
                                    }}
                                >
                                    New Chat
                                </Button>
                            )}
                            {tab === "Prompts" && (
                                <Text>TEST</Text>
                            )}
                        </Box>
                    </Navbar.Section>
                    <Navbar.Section grow component={ScrollArea}>
                    {tab === "Chats" && <Chats />}
                    </Navbar.Section>
                    <Navbar.Section sx={{ borderTop: border }} p="xs">
                        <Center>
                            <Tooltip label="Settings">
                                <ActionIcon sx={{ flex: 1 }} size="xl">
                                    <IconSettings size={20} />
                                </ActionIcon>
                            </Tooltip>
                            <LoginModal>
                                <Tooltip label="Login">
                                    <ActionIcon sx={{ flex: 1 }} size="xl">
                                        <IconLogin size={20} />
                                    </ActionIcon>
                                </Tooltip>
                            </LoginModal>
                        </Center>
                    </Navbar.Section>
                </ Navbar>
            }
            layout="alt"
            padding={0}
        >
        <Outlet />
        </AppShell>
    );
}