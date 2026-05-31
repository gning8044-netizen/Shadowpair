              text: `✅ *PURGE TERMINÉE*\n\nLe groupe a été entièrement nettoyé. Seuls les administrateurs sont restés.`
            });

          } catch (error) {
            console.error(error);
            await connector.sendMessage(userId, from, {
              text: '❌ Une erreur est survenue pendant l\'expulsion. Assurez-vous que le bot est toujours administrateur.'
            });
          }
        }
      }, 5000); // Mise à jour toutes les 5 secondes

    } catch (error) {
      console.error(error);
      await connector.sendMessage(userId, from, {
        text: '❌ Impossible d\'initialiser la purge. Vérifiez les droits du bot.'
      });
    }
  }
};
