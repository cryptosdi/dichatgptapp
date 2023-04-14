import {
    ActionIcon,
    AppShell,
    Box,
    Burger,
    Button,
    Center,
    Header,
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
import { Link, Outlet, useNavigate, useRouter } from "@tanstack/react-location";
import { LogoBIcon } from "./Logo";


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
            header={<Header height={5} p="xs">{ }</Header>}
            footer={
                <Footer height={5} p="xs">
                </Footer>
            }
            aside={
                <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                    <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 5, lg: 5 }}>
                    </Aside>
                </MediaQuery>
            }
            navbar={
                <Navbar p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
                    <Navbar.Section className="app-region-drag">
                        <Box
                            style={{
                                height: 30,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderBottom: border,
                            }}
                        >
                            <LogoBIcon style={{
                                height: 20,
                                display: "block",
                            }}
                            ></LogoBIcon>
                            <Text weight="bold">Dichatgpt</Text>
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