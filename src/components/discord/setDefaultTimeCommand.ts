import { Client, CommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

export const setDefaultTimeCommand = () => ({
  data: new SlashCommandBuilder()
    .setName(rosetty.t('setDefaultTimeCommand')!)
    .setDescription(rosetty.t('setDefaultTimeCommandDescription')!)
    .addIntegerOption((option) =>
      option
        .setName(rosetty.t('setDefaultTimeCommandOptionText')!)
        .setDescription(rosetty.t('setDefaultTimeCommandOptionTextDescription')!)
        .setRequired(true),
    ),
  handler: async (interaction: CommandInteraction, discordClient: Client) => {
    const number = interaction.options.get(rosetty.t('setDefaultTimeCommandOptionText')!)?.value as number;

    const userId = interaction.user.id;
    const guildMember = await discordClient.guilds
      .fetch(interaction.guildId!)
      .then((guild) => guild.members.fetch(userId!));

    if (!guildMember.permissions.has(PermissionFlagsBits.Administrator)) {
      await interaction.reply({
        embeds: [new EmbedBuilder().setTitle(rosetty.t('notAllowed')!).setColor(0xe74c3c)],
        ephemeral: true,
      });

      return;
    }

    await prisma.guild.upsert({
      where: {
        id: interaction.guildId!,
      },
      create: {
        id: interaction.guildId!,
        defaultMediaTime: number || null,
      },
      update: {
        defaultMediaTime: number || null,
      },
    });

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(rosetty.t('success')!)
          .setDescription(rosetty.t('setDefaultTimeCommandAnswer')!)
          .setColor(0x2ecc71),
      ],
      ephemeral: true,
    });
  },
});
