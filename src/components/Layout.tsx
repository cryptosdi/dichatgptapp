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
    IconX,
} from "@tabler/icons-react";

import { Link, Outlet, useNavigate, useRouter } from "@tanstack/react-location";
import { LogoDIcon, LogoLIcon } from "./Logo";


export default function Layout() {
    const theme = useMantineTheme();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    const border = `${rem(1)} solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
        }`;

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
                </Navbar>
            }
            layout="alt"
            padding={0}
        >

        </AppShell>
    );
}