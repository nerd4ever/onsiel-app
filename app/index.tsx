import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUniversity, faGraduationCap, faCalendar, faBook, faCar, faUsers, faHome, faUser } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Guard from './guard';
export default function Index() {
  const [userName, setUserName] = useState('Usuário');
  const [userEmail, setUserEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    // Obter dados do usuário e imagem do perfil (pode ser do AsyncStorage ou API)
    const fetchUserData = async () => {
      const email = await AsyncStorage.getItem('userEmail'); // Supondo que você tenha armazenado o email do usuário
      const name = await AsyncStorage.getItem('userName') || 'Usuário';
      setUserEmail(email || '');
      setUserName(name);

      if (email) {
        // setProfileImage(`https://www.gravatar.com/avatar/${md5(email)}?s=200&d=identicon`); // Gravatar URL
      }
    };

    fetchUserData();
  }, []);

  const menuItems = [
    { title: 'Instituições', icon: faUniversity, color: '#3498db' },
    { title: 'Graduações', icon: faGraduationCap, color: '#2ecc71' },
    { title: 'Eventos', icon: faCalendar, color: '#e74c3c' },
    { title: 'Cursos', icon: faBook, color: '#9b59b6' },
    { title: 'Caronas', icon: faCar, color: '#f39c12' },
    { title: 'Grupos de Estudo', icon: faUsers, color: '#34495e' },
    { title: 'Repúblicas', icon: faHome, color: '#d35400' },
    { title: 'Meu Perfil', icon: faUser, color: '#1abc9c' },
  ];
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: profileImage || 'https://www.gravatar.com/avatar/?d=mp&s=200' }}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{userName}</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={[styles.menuItem, { backgroundColor: item.color }]}>
            <FontAwesomeIcon icon={item.icon} size={30} color="#fff" />
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    color: '#fff',
  },
  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  menuItem: {
    width: '45%',
    height: 100,
    margin: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
  },
});