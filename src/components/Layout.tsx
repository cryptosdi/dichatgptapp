import { useState } from 'react';
import {
    AppShell,
    Navbar, Button,
    Text,
    useMantineTheme,
} from '@mantine/core';

import { ChevronLeftIcon, ChevronRightIcon } from '@modulz/radix-icons';

export default function Layout() {
    const [opened, setOpened] = useState(false);

    const handleToggle = () => {
        setOpened(!opened);
    };
    return (
        <AppShell
        >
        layout AppShell
        </AppShell>
    );
}