import { MessageDeleteModal } from '@aurora_app/ui-library';
import { connect } from 'dva';
import { findIndex, min, range } from 'lodash';
import React, { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useOrientation } from 'react-use';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List as VList } from 'react-virtualized';
import MessageItemRender from '../components/Message/MessageItemRender';

import { FileModel } from '../../../models/file';
import { UserProfile } from '../../../models/user';
import { formatMessage } from '../../../utils';
import { initialMessage } from '../models/channel';

import { PageInfo } from '../../../utils/PageHelper';
import { Channel, Message, MessageRender } from '..//models/typed.d';

import styles from './MessageList.module.scss';

interface Props {
  loading: boolean;
  anchor?: any;
  threadId: string;
  activeMessage: Message;
  listHeight: number;
  listWidth: number;
  pageInfo: PageInfo;
  channels?: Channel[];
  profile: UserProfile;
  messages: MessageRender[];
  vListHeight: number;
  rowHeights: any[];
  repliedMessageIdx: number;
  replyDeletedMessageIdx: number;
  editableMessageIdx: number;
  resetRowHeights: () => void;
  downloadFile: (file: FileModel) => void;
  setEditable: (message: Message) => void;
  startThread: (messageId: string) => void;
  deleteMessage: (messageId: string) => void;
  unsetEditable: (messageId: string) => void;
  addRowHeight: (id: string, height: number) => void;
  cancelUpload: (message: Message, file: FileModel) => void;
  fetchMessages: (roomId: string, pageInfo: PageInfo) => void;
  updateMessage: (messageId: string) => (text: string) => void;
  forwardMessage: (threadId: string, messageId: string, text: string) => void;
}

const cache = new CellMeasurerCache({
  fixedWidth: true,
  minHeight: 0,
});

export const MessageList: FC<Props> = (props) => {
  const {
    loading,
    anchor,
    profile,
    threadId,
    pageInfo,
    listHeight,
    listWidth,
    messages,
    vListHeight,
    rowHeights,
    startThread,
    setEditable,
    cancelUpload,
    downloadFile,
    addRowHeight,
    unsetEditable,
    activeMessage,
    deleteMessage,
    updateMessage,
    fetchMessages,
    resetRowHeights,
    repliedMessageIdx,
    editableMessageIdx,
    replyDeletedMessageIdx,
  } = props;

  const [id, setId] = useState('');
  const [message, setMessage] = useState<Message>(initialMessage);
  const [modalShown, setModalShown] = useState('');
  const listRef = useRef<VList | null>(null);
  const orientation = useOrientation();
  const currentPage = pageInfo.getCurrentPage();

  const scrollTo = useCallback((rowIndex: number) => {
    if (listRef && listRef.current) {
      listRef.current.scrollToRow(rowIndex);

      const scrollToRowTimer = setTimeout(() => {
        if (listRef && listRef.current) {
          listRef.current.scrollToRow(rowIndex);
        }
      }, 10);

      clearTimeout(scrollToRowTimer);
    }
  }, []);

  const recomputeRowHeight = (rowIdx: number) => {
    listRef.current?.recomputeRowHeights(rowIdx);
  };

  const scrollToBottom = useCallback(() => {
    scrollTo(messages.length);
  }, [scrollTo, messages.length]);

  const setRemovable = (message: Message): void => {
    message && message.id && setId(message.id);
    message && setMessage(message);
    setModalShown('delete');
  };

  const setShareable = (message: Message): void => {
    // todo
  };

  const clearCache = useCallback(
    ({ start = -1, end = messages.length, scrollToPos = -1, recomputeFromPos = -1 }) => {
      if (start > -1 && end) {
        for (const i of range(start, end)) {
          cache.clear(i, 0);
        }
      } else {
        cache.clearAll();
      }
      if (scrollToPos > -1) {
        setTimeout(() => scrollTo(scrollToPos), 100);
      }
      if (recomputeFromPos > -1) {
        recomputeRowHeight(recomputeFromPos);
      }
    },
    [messages.length],
  );

  // const refs: Message = messages
  //   ? messages.reduce((acc, { id }) => {
  //       id && (acc[id] = createRef());
  //       return acc;
  //     }, {})
  //   : {};

  const renderRow = ({ key, index, parent, style }: any): ReactNode => {
    const message: MessageRender = messages[index] || { ...initialMessage, repeated: false, divided: false };
    const { height } = style;

    const idx = findIndex(rowHeights, (row) => row.id === message.id);

    if (!isNaN(height)) {
      if (idx === -1) {
        addRowHeight(message.id, height);
      } else if (height !== rowHeights[idx].length) {
        // We don't need to update the row height right now,
        // but may need in the future
        // updateRowHeight(message.id, height, idx);
      }
    }

    return (
      <CellMeasurer cache={cache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
        <div key={key} style={style} className={message.id === anchor ? styles.highlighted : ''}>
          <MessageItemRender
            message={message}
            profile={profile}
            onCancel={cancelUpload}
            onDownload={downloadFile}
            startThread={startThread}
            setEditable={setEditable}
            setShareable={setShareable}
            setRemovable={setRemovable}
            updateMessage={updateMessage}
            unsetEditable={unsetEditable}
          />
        </div>
      </CellMeasurer>
    );
  };

  /** scroll to bottom when:
   * 1.receive the latest message
   * 2.orientation of mobile devices
   */
  const lastMessage: Message | null = messages && messages.length ? messages[messages.length - 1] : null;
  const lastUpdated: Date | undefined = lastMessage?.updatedAt;

  useEffect(() => {
    setTimeout(scrollToBottom, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastUpdated, orientation]);

  /** recompute vList height:
   * 1.switch chat room
   * 2.load previous data
   */
  useEffect(() => {
    clearCache({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId, currentPage]);

  /**
   * recompute vList height:
   * 1.change window width
   */
  useEffect(() => {
    const pos: number = findIndex(messages, (message: Message) => message.id === activeMessage.id);
    const idx: number = pos > -1 ? pos : lastFocusedMessageIdx;
    clearCache({
      scrollToPos: idx,
      recomputeFromPos: idx,
    });
  }, [clearCache, listWidth]);

  /** set last focused message idx
   * 1.open / close thread conversation
   * 3.change active message
   */
  const [lastFocusedMessageIdx, setLastFocusedMessageIdx] = useState(-1);

  useEffect(() => {
    const idx: number = findIndex(messages, (message: Message) => message.id === activeMessage.id);
    if (idx > -1) {
      setLastFocusedMessageIdx(idx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearCache, activeMessage]);

  /** recompute vList height:
   * 1.edit message
   * 2.cancel the editable status
   */
  useEffect(() => {
    const idx: number = editableMessageIdx > -1 ? editableMessageIdx : lastFocusedMessageIdx;
    setLastFocusedMessageIdx(editableMessageIdx);
    clearCache({
      start: idx,
      scrollToPos: idx,
      recomputeFromPos: idx,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearCache, editableMessageIdx]);

  /** recompute vList height:
   * 1.reply a message
   */
  useEffect(() => {
    const idx: number = repliedMessageIdx > -1 ? repliedMessageIdx : lastFocusedMessageIdx;
    setLastFocusedMessageIdx(repliedMessageIdx);
    clearCache({
      start: idx,
      scrollToPos: idx,
      recomputeFromPos: idx,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearCache, repliedMessageIdx]);

  /** recompute vList hight:
   * 1.delete reply
   */
  useEffect(() => {
    const idx: number = replyDeletedMessageIdx > -1 ? replyDeletedMessageIdx : lastFocusedMessageIdx;
    setLastFocusedMessageIdx(replyDeletedMessageIdx);
    clearCache({
      start: idx,
      scrollToPos: idx,
      recomputeFromPos: idx,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearCache, replyDeletedMessageIdx]);

  /**
   * scroll back after loading previous data
   */
  const firstMessage: Message | null = messages && messages.length ? messages[0] : null;
  const firstUpdated: Date | undefined = firstMessage?.updatedAt;

  useEffect(() => {
    const page: number = pageInfo.getPage();
    const perPage: number = pageInfo.getPerPage();

    if (messages.length && page > 1) {
      const rowIndex: number = messages.length - (page - 1) * perPage;
      setTimeout(() => scrollTo(rowIndex), 100);
    }
    /**
     * do not put messages.length in the dependencies
     * or it will scroll when sending new message
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollTo, pageInfo, firstUpdated]);

  /** scroll to load previous data */
  const onScroll = ({ scrollTop }: any) => {
    const page = pageInfo.getPage();
    const pageCount = pageInfo.getPageCount();

    if (scrollTop === 0 && !loading) {
      if (threadId && page < pageCount) {
        fetchMessages(threadId, pageInfo.jumpPage(page + 1));
      }
    }
  };

  /** To match with the UI design
   * if the current chat messages list can't fill the viewport,
   * the messages chat list should be aligned at the bottom
   */
  const [virtualListHeight, setVirtualListHeight] = useState(0);
  const [virtualListMarginTop, setVirtualListMarginTop] = useState(0);

  const computeListHeight = useCallback(() => {
    const height = min([listHeight, vListHeight]) || 0;

    setVirtualListHeight(height);
    if (vListHeight < listHeight) {
      setVirtualListMarginTop(listHeight - vListHeight);
    } else {
      setVirtualListMarginTop(0);
    }
  }, [listHeight, vListHeight]);

  /**
   * recompute vList height
   * 1.delete current selected message
   * 2.change virtual list height
   * 3.reply a message
   */
  useEffect(() => {
    computeListHeight();
  }, [computeListHeight, repliedMessageIdx, vListHeight]);

  useEffect(() => {
    resetRowHeights();
  }, [resetRowHeights, threadId]);

  return (
    <>
      <AutoSizer>
        {({ width, height }: any) => {
          return (
            <VList
              ref={listRef}
              width={width}
              height={height}
              onScroll={onScroll}
              rowRenderer={renderRow}
              className={styles.messages}
              rowHeight={cache.rowHeight}
              deferredMeasurementCache={cache}
              scrollToAlignment="center"
              rowCount={messages ? messages.length : 0}
              style={{ height: virtualListHeight, marginTop: virtualListMarginTop }}
            />
          );
        }}
      </AutoSizer>
      <MessageDeleteModal
        message={message}
        visible={modalShown}
        onOk={() => {
          deleteMessage(id);
          setModalShown('');
        }}
        onCancel={() => setModalShown('')}
      />
    </>
  );
};

const mapStateToProps = ({ loading, channel, global }) => ({
  ...channel,
  profile: global.profile,
  activeMessage: channel.message,
  loading: loading.effects['channel/fetchMessages'],
  messages: formatMessage(channel.channel.messages, global.profile),
});

const mapDispatchToProps = (dispatch) => ({
  fetchMessages(id: number, pageInfo: PageInfo) {
    dispatch({ type: 'channel/fetchMessages', payload: { id, pageInfo } });
  },

  setEditable(message: Message) {
    dispatch({ type: 'channel/setMessageEditable', payload: { messageId: message.id } });
  },

  unsetEditable(messageId: string) {
    dispatch({
      type: 'channel/updateMessage',
      payload: { messageId, updates: { editable: false } },
    });
  },

  updateMessage(messageId: string) {
    return (text: string) => {
      dispatch({ type: 'channel/socketUpdateMessage', payload: { id: messageId, text } });
    };
  },

  deleteMessage(messageId: string) {
    dispatch({
      type: 'channel/socketDeleteMessage',
      payload: { id: messageId },
    });
  },

  addRowHeight(id: string, height: number) {
    dispatch({ type: 'channel/addRowHeight', payload: { id, height } });
  },

  updateRowHeight(id: string, height: number, idx: number) {
    dispatch({ type: 'channel/updateRowHeight', payload: { id, height, idx } });
  },

  resetRowHeights() {
    dispatch({ type: 'channel/setRowHeights', payload: { rowHeights: [] } });
  },

  downloadFile(file: FileModel) {
    dispatch({ type: 'fileUpload/downloadFile', payload: file });
  },

  cancelUpload(message: Message, file: FileModel) {
    dispatch({ type: 'message/cancelUpload', payload: { message, file } });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MessageList);
