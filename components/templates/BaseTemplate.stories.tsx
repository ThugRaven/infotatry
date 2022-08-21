import { ComponentMeta, ComponentStory } from '@storybook/react';
import BaseTemplate from './BaseTemplate';

export default {
  title: 'templates/BaseTemplate',
  component: BaseTemplate,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof BaseTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof BaseTemplate> = (args) => (
  <BaseTemplate {...args} />
);

// More on args: https://storybook.js.org/docs/react/writing-stories/args
export const Base = Template.bind({});
Base.args = {
  prop: 'BaseTemplate',
};
