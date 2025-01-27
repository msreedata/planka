import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Menu } from 'semantic-ui-react';
import { Input, Popup } from '../../lib/custom-ui';

import { useField } from '../../hooks';
import Item from './Item';

import styles from './BoardMembershipsStep.module.scss';

const BoardMembershipsStep = React.memo(
  ({ items, currentUserIds, title, onUserSelect, onUserDeselect, onBack }) => {
    const [t] = useTranslation();
    const [searchValue, handleSearchFieldChange] = useField('');
    const search = useMemo(() => searchValue.trim().toLowerCase(), [searchValue]);

    const filteredItems = useMemo(
      () =>
        items.filter(
          ({ user }) =>
            user.email.includes(search) ||
            user.name.toLowerCase().includes(search) ||
            (user.username && user.username.includes(search)),
        ),
      [items, search],
    );

    const searchField = useRef(null);

    const handleUserSelect = useCallback(
      (id) => {
        onUserSelect(id);
      },
      [onUserSelect],
    );

    const handleUserDeselect = useCallback(
      (id) => {
        onUserDeselect(id);
      },
      [onUserDeselect],
    );

    useEffect(() => {
      searchField.current.focus();
    }, []);

    return (
      <>
        <Popup.Header onBack={onBack}>{t(title)}</Popup.Header>
        <Popup.Content>
          <Input
            fluid
            ref={searchField}
            value={searchValue}
            placeholder={t('common.searchMembers')}
            icon="search"
            onChange={handleSearchFieldChange}
          />
          {filteredItems.length > 0 && (
            <Menu secondary vertical className={styles.menu}>
              {filteredItems.map((item) => (
                <Item
                  key={item.id}
                  isPersisted={item.isPersisted}
                  isActive={currentUserIds.includes(item.user.id)}
                  user={item.user}
                  onUserSelect={() => handleUserSelect(item.user.id)}
                  onUserDeselect={() => handleUserDeselect(item.user.id)}
                />
              ))}
            </Menu>
          )}
        </Popup.Content>
      </>
    );
  },
);

BoardMembershipsStep.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  items: PropTypes.array.isRequired,
  currentUserIds: PropTypes.array.isRequired,
  /* eslint-enable react/forbid-prop-types */
  title: PropTypes.string,
  onUserSelect: PropTypes.func.isRequired,
  onUserDeselect: PropTypes.func.isRequired,
  onBack: PropTypes.func,
};

BoardMembershipsStep.defaultProps = {
  title: 'common.members',
  onBack: undefined,
};

export default BoardMembershipsStep;
