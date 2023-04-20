import {
  ActionIcon,
  Box,
  Card,
  Code,
  CopyButton,
  Flex,
  Table,
  ThemeIcon,
  useMantineTheme,
  Tooltip,
} from "@mantine/core";
import { IconCopy, IconUser } from "@tabler/icons-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message } from "../utils/index";
import "../styles/markdown.scss"
import { LogoBIcon, LogoWIcon } from "./Logo";
import { ScrollIntoView } from "./ScrollIntoView";

export function MessageItem({ message }: { message: Message }) {
  const theme = useMantineTheme();
  return (
    <ScrollIntoView>
      <Card withBorder>
        <Flex gap="sm">
          {message.role === "user" && (
            <ThemeIcon color="gray" size="lg">
              <IconUser size={20} />
            </ThemeIcon>
          )}
          {message.role === "assistant" &&
            (theme.colorScheme === "dark" ? <LogoWIcon style={{ height: 30 }} /> : <LogoBIcon style={{ height: 30 }} />)
          }

          <Box sx={{ flex: 1, width: 0 }} className="markdown">
            <ReactMarkdown
              children={message.content}
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ node, ...props }) => (
                  <Table verticalSpacing="sm" highlightOnHover {...props} />
                ),
                code: ({ node, inline, ...props }) =>
                  inline ? (
                    <Code {...props} />
                  ) : (
                    <Box sx={{ position: "relative" }}>
                      <Code block {...props} />
                      <CopyButton value={String(props.children)}>
                        {({ copied, copy }) => (
                          <Tooltip
                            label={copied ? "Copied" : "Copy"}
                            position="left"
                          >
                            <ActionIcon
                              sx={{ position: "absolute", top: 4, right: 4 }}
                              onClick={copy}
                            >
                              <IconCopy opacity={0.4} size={20} />
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </CopyButton>
                    </Box>
                  ),
              }}
            />
          </Box>
          <Box>
            <CopyButton value={message.content}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? "Copied" : "Copy"} position="left">
                  <ActionIcon onClick={copy}>
                    <IconCopy opacity={0.5} size={20} />
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </Box>
        </Flex>
      </Card>
    </ScrollIntoView>
  );
}
