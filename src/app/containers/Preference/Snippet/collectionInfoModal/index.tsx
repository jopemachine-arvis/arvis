/* eslint-disable react/no-array-index-key */

import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Input,
  Label,
} from 'reactstrap';
import fse from 'fs-extra';
import plist from 'plist';
import path from 'path';
import { arvisSnippetCollectionPath } from '@config/path';
import { OuterContainer } from './components';
import * as styles from './style';

type IProps = {
  opened: boolean;
  setOpened: (opened: boolean) => void;
  collection: string;
  collectionInfo?: SnippetCollectionInfo;
  reloadSnippets: () => void;
};

const CollectionInfoModal = (props: IProps) => {
  const { opened, setOpened, collection, collectionInfo, reloadSnippets } =
    props;

  const toggle = () => setOpened(!opened);

  const [name, setName] = useState<string>('');

  const [prefix, setPrefix] = useState<string>('');

  const [suffix, setSuffix] = useState<string>('');

  useEffect(() => {
    if (collection) {
      setName(collection);
    }
  }, [collection]);

  useEffect(() => {
    if (collectionInfo) {
      setPrefix(collectionInfo.snippetKeywordPrefix ?? '');
      setSuffix(collectionInfo.snippetKeywordSuffix ?? '');
    }
  }, [collectionInfo]);

  const rebuildPlist = (plistPath: string) => {
    const plistStr = plist.build(
      {
        snippetkeywordprefix: prefix,
        snippetkeywordsuffix: suffix,
      },
      {
        allowEmpty: true,
        pretty: true,
        dontPrettyTextNodes: false,
        indent: '\t',
      }
    );

    return fse.writeFile(plistPath, plistStr, { encoding: 'utf8' });
  };

  const saveBtnHandler = () => {
    const oldCollectionDirName = path.resolve(
      arvisSnippetCollectionPath,
      collection
    );
    const infoPlistPath = path.resolve(oldCollectionDirName, 'info.plist');

    rebuildPlist(infoPlistPath)
      .then(() => {
        const newCollectionDirName = path.resolve(
          arvisSnippetCollectionPath,
          name
        );

        if (oldCollectionDirName !== newCollectionDirName) {
          fse
            .rename(oldCollectionDirName, newCollectionDirName)
            .then(reloadSnippets)
            .catch(console.error);
        } else {
          reloadSnippets();
        }

        return null;
      })
      .catch(console.error);

    toggle();
  };

  return (
    <OuterContainer>
      <Modal
        fade
        centered
        isOpen={opened}
        toggle={toggle}
        style={{
          color: '#212529',
        }}
      >
        <ModalHeader toggle={toggle}>
          Edit snippet collection information
        </ModalHeader>
        <ModalBody>
          <FormGroup check>
            <Label check style={styles.labelStyle}>
              Name
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                type="text"
              />
            </Label>
            <Label check style={styles.labelStyle}>
              Prefix
              <Input
                value={prefix}
                onChange={(e) => {
                  setPrefix(e.target.value);
                }}
                type="text"
              />
            </Label>
            <Label check style={styles.labelStyle}>
              Suffix
              <Input
                value={suffix}
                onChange={(e) => {
                  setSuffix(e.target.value);
                }}
                type="text"
              />
            </Label>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={saveBtnHandler}>
            Save
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </OuterContainer>
  );
};

CollectionInfoModal.defaultProps = {
  collectionInfo: undefined,
};

export default CollectionInfoModal;
