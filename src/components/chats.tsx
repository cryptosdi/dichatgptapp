import { ActionIcon, Flex, Menu } from "@mantine/core";
import { IconDotsVertical, IconMessages } from "@tabler/icons-react";
import { Link } from "@tanstack/react-location";

import { DeleteChatModal } from "./DeleteChatModal";
import { EditChatModal } from "./EditChatModal";
import { MainLink } from "./MainLink";
import { Chat } from "../utils/index";

export function Chats({ search }: { search: string }) {
    //   const chatId = useChatId();
    const chatId = "1";
    const chats: Chat[] = [
        {
            id: "1",
            description: "Alice",
            createdAt: new Date("2021-10-01"),
        },
        {
            id: "2",
            description: "tobp",
            createdAt: new Date("2022-10-01"),
        }
    ];
    const chat = chats[0]

    return (
        <>
            <Flex
                key={chat.id}
                className={chatId === chat.id ? "active" : undefined}
                sx={(theme) => ({
                    marginTop: 1,
                    "&:hover, &.active": {
                        backgroundColor:
                            theme.colorScheme === "dark"
                                ? theme.colors.dark[6]
                                : theme.colors.gray[1],
                    },
                })}
            >
                <Link to={`/chats/${chat.id}`} style={{ flex: 1 }}>
                    <MainLink
                        icon={<IconMessages size="1rem" />}
                        color="teal"
                        chat={chat}
                        label={chat.description}
                    />
                </Link>
                <Menu shadow="md" width={200} keepMounted>
                    <Menu.Target>
                        <ActionIcon sx={{ height: "auto" }}>
                            <IconDotsVertical size={20} />
                        </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <EditChatModal chat={chat}>
                            <Menu.Item>Edit</Menu.Item>
                        </EditChatModal>
                        <DeleteChatModal chat={chat}>
                            <Menu.Item>Delete</Menu.Item>
                        </DeleteChatModal>
                    </Menu.Dropdown>
                </Menu>
            </Flex>
        </>
    );
}
