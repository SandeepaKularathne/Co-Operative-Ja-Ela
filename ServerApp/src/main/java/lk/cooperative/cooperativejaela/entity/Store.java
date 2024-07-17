package lk.cooperative.cooperativejaela.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import java.sql.Date;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Store {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "storenumber")
    @Pattern(regexp = "^[A-Z]\\d{3}$", message = "Invalid Number")
    private String storenumber;
    @Basic
    @Column(name = "location")
    @Pattern(regexp = "^.*$", message = "Invalid Location")
    private String location;
    @Basic
    @Column(name = "esdate")
    private Date esdate;
    @Basic
    @Column(name = "cnumber")
    private String cnumber;
    @JsonIgnore
    @OneToMany(mappedBy = "store")
    private Collection<Grnitem> grnitems;
    @Basic
    @Column(name = "email")
    @Pattern(regexp = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", message = "Invalid Email Address")
    private String email;
    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    private Employee employee;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getStorenumber() {
        return storenumber;
    }

    public void setStorenumber(String storenumber) {
        this.storenumber = storenumber;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Date getEsdate() {
        return esdate;
    }

    public void setEsdate(Date esdate) {
        this.esdate = esdate;
    }

    public String getcnumber() {
        return cnumber;
    }

    public void setcnumber(String cnumber) {
        this.cnumber = cnumber;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Store store = (Store) o;
        return id == store.id && Objects.equals(storenumber, store.storenumber) && Objects.equals(location, store.location) && Objects.equals(esdate, store.esdate) && Objects.equals(cnumber, store.cnumber);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, storenumber, location, esdate, cnumber);
    }

    public Collection<Grnitem> getGrnitems() {
        return grnitems;
    }

    public void setGrnitems(Collection<Grnitem> grnitems) {
        this.grnitems = grnitems;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }
}
