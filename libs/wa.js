          resolve({ success: true, alreadyConnected: true });
        }
      });
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  async sendMessage(userId, jid, content) {
    const client = clients.get(userId);
    if (!client || !client.isConnected) return null;
    try {
      return await client.sock.sendMessage(jid, content);
    } catch (e) {
      return null;
    }
  }

  isConnected(userId) {
    const client = clients.get(userId);
    return client ? client.isConnected : false;
  }

  getBotNumber(userId) {
    const client = clients.get(userId);
    return client ? client.botNumber : null;
  }

  getClient(userId) {
    return clients.get(userId);
  }
}

module.exports = new WhatsAppConnector();
