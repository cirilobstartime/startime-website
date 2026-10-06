import * as migration_20260909_212817_maintenance_mode from './20260909_212817_maintenance_mode';
import * as migration_20260929_003000_home_archive_sort from './20260929_003000_home_archive_sort';
import * as migration_20260929_110000_marketing_notice_toggle from './20260929_110000_marketing_notice_toggle';
import * as migration_20260929_140000_footer_duns_url from './20260929_140000_footer_duns_url';
import * as migration_20260930_185741_careers_jobs from './20260930_185741_careers_jobs';
import * as migration_20260930_210451_editorial_news_articles from './20260930_210451_editorial_news_articles';
import * as migration_20260930_220000_external_link_rules from './20260930_220000_external_link_rules';
import * as migration_20261005_180000_icon_settings from './20261005_180000_icon_settings';
import * as migration_20261005_190000_page_slug_redirects from './20261005_190000_page_slug_redirects';
import * as migration_20261005_200000_design_settings from './20261005_200000_design_settings';

export const migrations = [
  {
    up: migration_20260909_212817_maintenance_mode.up,
    down: migration_20260909_212817_maintenance_mode.down,
    name: '20260909_212817_maintenance_mode',
  },
  {
    up: migration_20260929_003000_home_archive_sort.up,
    down: migration_20260929_003000_home_archive_sort.down,
    name: '20260929_003000_home_archive_sort',
  },
  {
    up: migration_20260929_110000_marketing_notice_toggle.up,
    down: migration_20260929_110000_marketing_notice_toggle.down,
    name: '20260929_110000_marketing_notice_toggle',
  },
  {
    up: migration_20260929_140000_footer_duns_url.up,
    down: migration_20260929_140000_footer_duns_url.down,
    name: '20260929_140000_footer_duns_url',
  },
  {
    up: migration_20260930_185741_careers_jobs.up,
    down: migration_20260930_185741_careers_jobs.down,
    name: '20260930_185741_careers_jobs',
  },
  {
    up: migration_20260930_210451_editorial_news_articles.up,
    down: migration_20260930_210451_editorial_news_articles.down,
    name: '20260930_210451_editorial_news_articles',
  },
  {
    up: migration_20260930_220000_external_link_rules.up,
    down: migration_20260930_220000_external_link_rules.down,
    name: '20260930_220000_external_link_rules'
  },
  {
    up: migration_20261005_180000_icon_settings.up,
    down: migration_20261005_180000_icon_settings.down,
    name: '20261005_180000_icon_settings',
  },
  {
    up: migration_20261005_190000_page_slug_redirects.up,
    down: migration_20261005_190000_page_slug_redirects.down,
    name: '20261005_190000_page_slug_redirects',
  },
  {
    up: migration_20261005_200000_design_settings.up,
    down: migration_20261005_200000_design_settings.down,
    name: '20261005_200000_design_settings',
  },
];
