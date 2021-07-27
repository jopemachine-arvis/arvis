/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable promise/no-nesting */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
/* eslint-disable promise/catch-or-return */
import React, { useContext, useEffect, useState } from 'react';
import _ from 'lodash';
import { Button, Form, FormGroup, Label } from 'reactstrap';
import { StyledInput } from '@components/index';
import './index.css';
import { SpinnerContext } from '@helper/spinnerContext';
import { Core } from 'arvis-core';
import semver from 'semver';
import * as style from './style';

type IProps = {
  info: any;
  installed: boolean | undefined;
  installExtension: ({
    extensionType,
    bundleId,
    installType,
  }: {
    extensionType: 'workflow' | 'plugin';
    bundleId: string;
    installType: string;
  }) => Promise<void>;
  uninstallExtension: ({
    extensionType,
    bundleId,
    installType,
  }: {
    extensionType: 'workflow' | 'plugin';
    bundleId: string;
    installType: string;
  }) => Promise<void>;
};

export default function ExtensionInfoTable(props: IProps) {
  const { info, installed, installExtension, uninstallExtension } = props;

  const [extensionCreator, setExtensionCreator] = useState<string>('');
  const [extensionDescription, setExtensionDescription] = useState<string>('');
  const [extensionName, setExtensionName] = useState<string>('');
  const [extensionVersion, setExtensionVersion] = useState<string>('');
  const [extensionWebsite, setExtensionWebsite] = useState<string>('');
  const [uploadedDateTime, setUploadedDateTime] = useState<string>('');
  const [totalDownloads, setTotalDownloads] = useState<string>('');
  const [lastWeekDownloads, setLastWeekDownloads] = useState<string>('');
  const [supportedPlatforms, setSupportedPlatforms] = useState<string>('');

  const bundleId = `${extensionCreator}.${extensionName}`;

  const [isSpinning, setSpinning] = useContext(SpinnerContext) as any;

  const installedExtensionInfo: any | undefined = info
    ? info.type === 'workflow'
      ? Core.getWorkflowList()[bundleId]
      : Core.getPluginList()[bundleId]
    : undefined;

  const currentVersion = installedExtensionInfo
    ? installedExtensionInfo.version
    : undefined;

  useEffect(() => {
    if (info) {
      const {
        creator = '',
        description = '(No description)',
        dt = '?',
        dw = '?',
        latest = '',
        name = '',
        uploaded = '?',
        webAddress = '',
        platform = 'win32, darwin and linux',
      } = info;

      setExtensionCreator(creator);
      setExtensionDescription(description);
      setExtensionName(name);
      setExtensionVersion(latest);
      setExtensionWebsite(webAddress);
      setTotalDownloads(dt);
      setLastWeekDownloads(dw);

      if (uploaded !== '?') {
        setUploadedDateTime(new Date(uploaded).toLocaleString());
      } else {
        setUploadedDateTime(uploaded);
      }

      if (typeof platform !== 'string') {
        setSupportedPlatforms(
          platform.join(', ').replace(/, ([^,]*)$/, ' and $1')
        );
      } else {
        setSupportedPlatforms(platform);
      }
    }
  }, [info]);

  const installHandler = () => {
    setSpinning(true);

    installExtension({
      bundleId,
      extensionType: info.type,
      installType: info.installType,
    })
      .catch(console.error)
      .finally(() => {
        setSpinning(false);
      });
  };

  const uninstallHandler = () => {
    setSpinning(true);

    uninstallExtension({
      bundleId,
      extensionType: info.type,
      installType: info.installType,
    })
      .catch(console.error)
      .finally(() => {
        setSpinning(false);
      });
  };

  let installBtnTxt;

  if (info && installed === false) {
    installBtnTxt = 'Install';
  } else if (
    info &&
    installed &&
    info.latest &&
    currentVersion &&
    extensionName === info.name &&
    semver.gt(info.latest, currentVersion)
  ) {
    installBtnTxt = 'Update';
  } else {
    installBtnTxt = 'Reinstall';
  }

  return (
    <Form style={style.descriptionContainerStyle}>
      <FormGroup style={style.formGroupStyle}>
        <Label style={style.labelStyle}>Name</Label>
        <StyledInput
          disabled
          type="text"
          placeholder="Name"
          value={extensionName}
        />
      </FormGroup>

      <FormGroup style={style.formGroupStyle}>
        <Label style={style.labelStyle}>Creator</Label>
        <StyledInput
          disabled
          type="text"
          placeholder="Creator"
          value={extensionCreator}
        />
      </FormGroup>

      <FormGroup style={style.formGroupStyle}>
        <Label style={style.labelStyle}>Latest version</Label>
        <StyledInput
          disabled
          type="text"
          placeholder="Latest version"
          value={extensionVersion}
        />
      </FormGroup>

      <FormGroup style={style.formGroupStyle}>
        <Label style={style.labelStyle}>Description</Label>
        <StyledInput
          disabled
          type="text"
          placeholder="Description"
          value={extensionDescription}
        />
      </FormGroup>

      <FormGroup style={style.formGroupStyle}>
        <Label style={style.labelStyle}>Web Site</Label>
        <StyledInput
          disabled
          type="url"
          placeholder="Web Site"
          value={extensionWebsite}
        />
      </FormGroup>

      <FormGroup style={style.formGroupStyle}>
        <Label style={style.labelStyle}>Total downloads</Label>
        <StyledInput
          disabled
          type="url"
          value={totalDownloads}
          placeholder="Total downloads"
        />
      </FormGroup>

      <FormGroup style={style.formGroupStyle}>
        <Label style={style.labelStyle}>Last week downloads</Label>
        <StyledInput
          disabled
          type="url"
          value={lastWeekDownloads}
          placeholder="Last week downloads"
        />
      </FormGroup>

      <FormGroup style={style.formGroupStyle}>
        <Label style={style.labelStyle}>Uploaded date</Label>
        <StyledInput
          disabled
          type="url"
          value={uploadedDateTime}
          placeholder="Uploaded date"
        />
      </FormGroup>

      <FormGroup style={style.formGroupStyle}>
        <Label style={style.labelStyle}>Supported platforms</Label>
        <StyledInput
          disabled
          type="url"
          value={supportedPlatforms}
          placeholder="Uploaded date"
        />
      </FormGroup>

      {info && (
        <Button
          style={{ ...style.installButton, marginTop: 30 }}
          size="md"
          onClick={installHandler}
        >
          {installBtnTxt}
        </Button>
      )}
    </Form>
  );
}
